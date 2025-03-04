from flask import Flask, request, render_template, jsonify
import os
import librosa
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import json

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'm4a'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load pre-trained audio classification model
# Note: You'll need to replace this with your actual model path
MODEL_PATH = 'audio_model.h5'

# Define class labels for the audio classifier
# Replace with your actual class labels
CLASS_LABELS = [
    "dog_bark", "rain", "crying_baby", "clock_tick", "helicopter",
    "sea_waves", "sneezing", "rooster", "car_horn", "fire_crackling"
]

# Prompt templates for different audio classes
PROMPT_TEMPLATES = {
    "dog_bark": "A realistic image of a {breed} dog with its mouth open, barking enthusiastically in a {setting}.",
    "rain": "A {mood} scene of rain falling on {surface} with {detail}.",
    "crying_baby": "A {mood} portrait of a baby with tears, being comforted by {person} in a {setting}.",
    "clock_tick": "A close-up of an intricate {style} clock with visible mechanism, showing the time {time}.",
    "helicopter": "A {type} helicopter flying over {landscape} during {time_of_day}.",
    "sea_waves": "Powerful ocean waves crashing against {object} during a {weather} at {time_of_day}.",
    "sneezing": "A person mid-sneeze with {detail} in a {setting}.",
    "rooster": "A colorful rooster with {detail} crowing at {time_of_day} on a {setting} farm.",
    "car_horn": "A {car_type} car in {setting} with someone honking the horn, showing {emotion} on their face.",
    "fire_crackling": "A {size} {mood} fire with sparks and embers in a {setting}."
}

# Additional details to enhance prompts
PROMPT_DETAILS = {
    "dog_breed": ["Golden Retriever", "German Shepherd", "Beagle", "Husky", "Poodle"],
    "setting": ["forest", "urban street", "cozy living room", "beach at sunset", "mountain landscape"],
    "mood": ["peaceful", "dramatic", "serene", "melancholic", "vibrant", "somber"],
    "surface": ["city streets", "windows", "leaves", "an umbrella", "a wooden deck"],
    "detail": ["droplets creating ripples", "foggy background", "gleaming feathers", "intense expression", "soft lighting"],
    "person": ["a parent", "a grandparent", "a sibling", "a caretaker"],
    "style": ["antique", "modern", "steampunk", "victorian", "minimalist"],
    "time": ["3:15", "midnight", "dawn", "12:00"],
    "type": ["military", "rescue", "news", "luxury"],
    "landscape": ["mountainous terrain", "urban cityscape", "desert", "ocean", "forest"],
    "time_of_day": ["sunrise", "midday", "sunset", "night"],
    "weather": ["stormy day", "calm evening", "sunny afternoon"],
    "object": ["rocky cliffs", "a lighthouse", "a small boat", "a sandy beach"],
    "car_type": ["vintage", "sports", "family", "luxury"],
    "emotion": ["frustration", "urgency", "amusement"],
    "size": ["small cozy", "massive roaring", "carefully controlled"]
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_features(file_path, max_pad_len=174):
    """Extract features from audio file using librosa"""
    try:
        # Load audio file
        audio, sample_rate = librosa.load(file_path, res_type='kaiser_fast')
        
        # Extract MFCC features
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        
        # Normalize the features
        mfccs = (mfccs - np.mean(mfccs)) / np.std(mfccs)
        
        # Pad or truncate to ensure consistent shape
        pad_width = max_pad_len - mfccs.shape[1]
        if pad_width > 0:
            mfccs = np.pad(mfccs, pad_width=((0, 0), (0, pad_width)), mode='constant')
        else:
            mfccs = mfccs[:, :max_pad_len]
            
        return mfccs.reshape(1, mfccs.shape[0], mfccs.shape[1], 1)
    
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        return None

def generate_prompt(audio_class, confidence):
    """Generate an AI image prompt based on audio classification"""
    import random
    
    # Get the prompt template for the class
    template = PROMPT_TEMPLATES.get(audio_class, "A detailed image representing {audio_class}.")
    
    # Replace placeholders with random details
    for placeholder in PROMPT_DETAILS:
        if "{" + placeholder + "}" in template:
            template = template.replace("{" + placeholder + "}", random.choice(PROMPT_DETAILS[placeholder]))
    
    # Add additional context based on confidence
    if confidence > 0.9:
        prefix = "High-quality, photorealistic "
    elif confidence > 0.7:
        prefix = "Detailed "
    else:
        prefix = "Artistic interpretation of "
    
    # Replace any remaining audio_class placeholders
    template = template.replace("{audio_class}", audio_class)
    
    return prefix + template

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file and allowed_file(file.filename):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        try:
            # Extract features
            features = extract_features(file_path)
            
            if features is None:
                return jsonify({'error': 'Failed to extract features from audio'})
            
            # Load model (lazy loading to save resources)
            model = load_model(MODEL_PATH)
            
            # Make prediction
            predictions = model.predict(features)[0]
            top_indices = np.argsort(predictions)[-3:][::-1]  # Get top 3 predictions
            
            results = []
            for i, idx in enumerate(top_indices):
                audio_class = CLASS_LABELS[idx]
                confidence = float(predictions[idx])
                
                # Only use classes with reasonable confidence
                if confidence > 0.2:
                    prompt = generate_prompt(audio_class, confidence)
                    results.append({
                        'rank': i+1,
                        'class': audio_class,
                        'confidence': f"{confidence:.2f}",
                        'prompt': prompt
                    })
            
            return jsonify({
                'success': True,
                'results': results
            })
            
        except Exception as e:
            return jsonify({'error': f'Analysis failed: {str(e)}'})
    
    return jsonify({'error': 'Invalid file type'})

@app.route('/record', methods=['POST'])
def record_audio():
    if 'audio_data' not in request.files:
        return jsonify({'error': 'No audio data'})
    
    audio_file = request.files['audio_data']
    file_path = os.path.join(UPLOAD_FOLDER, 'recorded_audio.wav')
    audio_file.save(file_path)
    
    # Process the audio file (reusing the upload logic)
    try:
        # Extract features
        features = extract_features(file_path)
        
        if features is None:
            return jsonify({'error': 'Failed to extract features from audio'})
        
        # Load model
        model = load_model(MODEL_PATH)
        
        # Make prediction
        predictions = model.predict(features)[0]
        top_indices = np.argsort(predictions)[-3:][::-1]
        
        results = []
        for i, idx in enumerate(top_indices):
            audio_class = CLASS_LABELS[idx]
            confidence = float(predictions[idx])
            
            if confidence > 0.2:
                prompt = generate_prompt(audio_class, confidence)
                results.append({
                    'rank': i+1,
                    'class': audio_class,
                    'confidence': f"{confidence:.2f}",
                    'prompt': prompt
                })
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)