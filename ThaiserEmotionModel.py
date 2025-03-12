import torch
from transformers import AutoConfig, AutoFeatureExtractor, AutoModelForAudioClassification
import librosa
import numpy as np
def load_model_for_ser(model_name="awghuku/wav2vec2-base-thai-ser"):
    """
    Load the Thai Speech Emotion Recognition model and feature extractor
    using a different approach that avoids tokenizer issues
    """
    # Load configuration
    config = AutoConfig.from_pretrained(model_name)
    
    # Load feature extractor (instead of processor)
    feature_extractor = AutoFeatureExtractor.from_pretrained(model_name)
    
    # Load model for audio classification
    model = AutoModelForAudioClassification.from_pretrained(model_name)
    
    return model, feature_extractor, config

def predict_emotion(audio_file_path, model, feature_extractor, config, sample_rate=16000):
    """
    Predict the emotion from an audio file
    """
    # Load audio file (resampling to 16kHz if needed)
    speech_array, sr = librosa.load(audio_file_path, sr=sample_rate)
    
    # Process the audio using feature extractor instead of processor
    inputs = feature_extractor(speech_array, sampling_rate=sample_rate, return_tensors="pt", padding=True)
    
    # Get the model prediction
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
    
    # Get the predicted class
    predicted_class_id = torch.argmax(logits, dim=-1).item()
    
    # Get emotion label from config
    emotion_labels = config.id2label
    predicted_emotion = emotion_labels[predicted_class_id]
    
    # Get confidence scores
    scores = torch.nn.functional.softmax(logits, dim=-1)[0].tolist()
    confidence_scores = {emotion_labels[i]: score for i, score in enumerate(scores)}
    
    return {
        "emotion" : predicted_emotion,
        "confidence_scores": confidence_scores
    }

def Thaiser(audio_file):
    # Example usage
    model_name = "awghuku/wav2vec2-base-thai-ser"
    # audio_file = "/uploads/recorded_audio.mp3"  # Replace with your audio file path
    
    try:
        # Load model, feature extractor and config
        print("Loading model and feature extractor...")
        model, feature_extractor, config = load_model_for_ser(model_name)
        
        print("Model and feature extractor loaded successfully!")
        print(f"Emotion labels: {config.id2label}")
        
        # Make prediction
        print(f"Processing audio file: {audio_file}")
        result = predict_emotion(audio_file, model, feature_extractor, config)
        
        # Print results
        print(f"\nPredicted emotion: {result['emotion']}")
        print("\nConfidence scores:")
        for emotion, score in result['confidence_scores'].items():
            print(f"{emotion}: {score:.4f}")
        return {
            "emotion": result['emotion'],
            "confidence_scores": result['confidence_scores']
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        print("\nTroubleshooting suggestions:")
        print("1. Verify the model exists on Hugging Face hub")
        print("2. Check your internet connection")
        print("3. Ensure you have sufficient disk space")
        print("4. Verify the audio file exists and is a valid format")



