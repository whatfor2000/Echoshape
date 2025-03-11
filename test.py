import os
import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor
import numpy as np
import soundfile as sf

def load_and_preprocess_audio(file_path, target_sr=16000):
    """
    Load audio file and preprocess it for Wav2Vec2 model
    """
    try:
        # Verify file exists and is readable
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")

        # Load audio file using torchaudio
        speech_array, sampling_rate = torchaudio.load(file_path)
        
        print(f"Sampling Rate: {sampling_rate}")
        print(f"Audio Shape: {speech_array.shape}")
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


speech_array, sampling_rate = load_and_preprocess_audio('uploads/recorded_audio.mp3')
# print(speech_array)
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
print(predicted_emotion)
print(emotion_probs)
