import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import keras
import tensorflow as tf

app = FastAPI(title="Image Classification API")

# Configure CORS for the Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

loaded_models = {}

def get_model(model_name: str):
    if model_name in loaded_models:
        return loaded_models[model_name]
    
    if model_name.startswith("Kera-"):
        file_name = f"save_at_{model_name.replace('Kera-', '')}.keras"
    else:
        file_name = f"{model_name}.keras"
        
    model_path = os.path.join(MODELS_DIR, file_name)
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail=f"Model file {file_name} not found")
    
    model = keras.saving.load_model(model_path)
    loaded_models[model_name] = model
    return model

@app.get("/models")
async def list_models():
    models_list = []
    for f in os.listdir(MODELS_DIR):
        if f.endswith(".keras"):
            if f.startswith("save_at_"):
                num = f.replace("save_at_", "").replace(".keras", "")
                models_list.append({"id": f"Kera-{num}", "name": f"Kera-{num}", "filename": f, "icon": "Layers"})
            else:
                name = f.replace(".keras", "")
                models_list.append({"id": name, "name": name, "filename": f, "icon": "Layers"})
    return sorted(models_list, key=lambda x: x["name"])

@app.post("/models")
async def upload_model(file: UploadFile = File(...)):
    if not file.filename.endswith(".keras"):
        raise HTTPException(status_code=400, detail="Only .keras files are allowed")

    file_path = os.path.join(MODELS_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        f = file.filename
        if f.startswith("save_at_"):
            num = f.replace("save_at_", "").replace(".keras", "")
            return {"id": f"Kera-{num}", "name": f"Kera-{num}", "filename": f}
        else:
            name = f.replace(".keras", "")
            return {"id": name, "name": name, "filename": f}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

@app.post("/predict")
async def predict_image(file: UploadFile = File(...), model_name: str = Form(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    
    try:
        model = get_model(model_name)
        img = keras.utils.load_img(file_path, target_size=(180, 180))
        img_array = keras.utils.img_to_array(img)
        img_array = keras.ops.expand_dims(img_array, 0)
        
        predictions = model.predict(img_array)
        
        raw_score = float(predictions[0][0])
        dog_raw = round(raw_score, 2)
        cat_raw = round(-raw_score, 2)
        
        # Apply sigmoid to convert raw logits to a 0-1 probability
        probability = float(keras.ops.sigmoid(predictions[0][0]))
        
        dog_confidence = round(100 * probability, 2)
        cat_confidence = round(100 * (1 - probability), 2)
        
        results = [
            {"label": "Dog", "confidence": dog_confidence, "raw_score": dog_raw},
            {"label": "Cat", "confidence": cat_confidence, "raw_score": cat_raw}
        ]
        results = sorted(results, key=lambda x: x["confidence"], reverse=True)
        
        return {
            "filename": file.filename,
            "model_used": model_name,
            "predictions": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
