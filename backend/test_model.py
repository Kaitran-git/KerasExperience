import os
# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import keras

try:
    model = keras.saving.load_model("models/save_at_25.keras")
    print("Input shape:", getattr(model, 'input_shape', 'Unknown'))
    if hasattr(model, 'outputs'):
        print("Output shape:", [o.shape for o in model.outputs])
    print("Layers:", len(model.layers))
except Exception as e:
    print("Error loading model:", e)
