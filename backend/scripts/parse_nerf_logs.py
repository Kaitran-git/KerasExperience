import json
import os
import re
from datetime import datetime

# Path to the frontend public folder where the React dashboard reads data
JSON_OUTPUT_PATH = "../../frontend/public/nerf_data/nerf_models.json"

def parse_keras_log(log_file_path):
    """
    Theoretical script to parse a Keras standard output log file
    and extract hyperparameters like Epochs, Samples, etc.
    """
    metadata = {
        "id": f"nerf-run-{datetime.now().strftime('%Y%m%d%H%M')}",
        "model_name": "Auto-Parsed NeRF",
        "num_samples": 0,
        "pos_encode_dims": 0,
        "epochs": 0,
        "training_time": "0m 0s",
        "gif_path": "/nerf_data/gifs/placeholder_new.gif",
        "mp4_path": "/nerf_data/mp4s/placeholder_new.mp4"
    }
    
    # In a real scenario, we'd open the log file and extract values via regex
    # Example Regex Patterns:
    # epochs_pattern = re.compile(r"Epoch (\d+)/(\d+)")
    # samples_pattern = re.compile(r"NUM_SAMPLES\s*=\s*(\d+)")
    
    # Mock extracted data:
    metadata["num_samples"] = 128
    metadata["pos_encode_dims"] = 12
    metadata["epochs"] = 1000
    metadata["training_time"] = "4h 20m"
    
    return metadata

def update_nerf_database(new_metadata):
    """
    Reads the existing JSON database, appends the new run, and writes it back.
    """
    if not os.path.exists(JSON_OUTPUT_PATH):
        print(f"File not found: {JSON_OUTPUT_PATH}")
        return
        
    with open(JSON_OUTPUT_PATH, 'r') as f:
        data = json.load(f)
        
    data.append(new_metadata)
    
    with open(JSON_OUTPUT_PATH, 'w') as f:
        json.dump(data, f, indent=2)
        
    print(f"Successfully added {new_metadata['model_name']} to dashboard!")

if __name__ == "__main__":
    # Simulate parsing a completed training run
    print("Parsing Keras training log...")
    new_data = parse_keras_log("dummy_training.log")
    
    print("Updating NeRF Dashboard Database...")
    update_nerf_database(new_data)
