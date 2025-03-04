from flask import Flask, render_template, request, jsonify
import os
import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor

app = Flask(__name__, template_folder="templates", static_folder="static")

# Load pretrained feature extractor and model
model_name = "ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition"
feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)

# Define emotion labels
EMOTION_LABELS = [
    "angry", 
    "calm", 
    "disgust", 
    "fear", 
    "happy", 
    "neutral", 
    "sad", 
    "surprise"
]

def load_and_preprocess_audio(file_path, target_sr=16000):
    """
    Load audio file and preprocess it for Wav2Vec2 model
    """
    try:
        # Verify file exists and is readable
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        # Load audio file using torchaudio
        speech_array, sampling_rate = torchaudio.load(file_path)
        
        # Resample if necessary
        if sampling_rate != target_sr:
            resampler = torchaudio.transforms.Resample(sampling_rate, target_sr)
            speech_array = resampler(speech_array)
        
        # Ensure mono channel
        if speech_array.ndim > 1:
            speech_array = speech_array.mean(dim=0)
        
        return speech_array.numpy(), target_sr
    
    except Exception as e:
        print(f"Audio loading error details: {e}")
        raise

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    audio_file = request.files["file"]
    
    # Debug: print file details
    print(f"Filename: {audio_file.filename}")
    print(f"Content Type: {audio_file.content_type}")
    
    # Ensure the uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Generate a unique filename with .mp3 extension
    import uuid
    unique_filename = f"{uuid.uuid4()}.mp3"
    audio_path = os.path.join("uploads", unique_filename)
    
    try:
        # Read file content into memory
        file_content = audio_file.read()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(audio_path), exist_ok=True)
        
        # Save the file content
        with open(audio_path, 'wb') as f:
            f.write(file_content)
        
        # Verify file was saved
        if not os.path.exists(audio_path):
            raise IOError(f"Failed to save file to {audio_path}")

        # Load and preprocess the audio
        speech_array, sampling_rate = load_and_preprocess_audio(audio_path)
        
        # Prepare inputs for the model
        inputs = feature_extractor(
            speech_array, 
            sampling_rate=sampling_rate, 
            return_tensors="pt", 
            padding=True
        )

        # Perform emotion recognition
        with torch.no_grad():
            logits = model(inputs.input_values).logits

        # Get probabilities and predicted emotion
        probabilities = torch.softmax(logits, dim=1)
        predicted_emotion_idx = torch.argmax(probabilities, dim=1).item()
        predicted_emotion = EMOTION_LABELS[predicted_emotion_idx]
        
        # Get emotion probabilities
        emotion_probs = {
            label: prob.item() 
            for label, prob in zip(EMOTION_LABELS, probabilities[0])
        }

        # Remove the file after processing
        os.remove(audio_path)

        return jsonify({
            "message": "Emotion recognized successfully",
            "emotion": predicted_emotion,
            "probabilities": emotion_probs
        })

    except Exception as e:
        # If processing fails, try to remove the file
        try:
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except:
            pass
        
        return jsonify({
            "error": f"Error processing audio: {str(e)}"
        }), 500

if __name__ == "__main__":
    app.run(debug=True)