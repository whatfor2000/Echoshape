import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import librosa
import numpy as np

def load_model():
    """
    Load the airesearch/wav2vec2-large-xlsr-53-th model and processor
    """
    # Load processor and model from HuggingFace
    processor = Wav2Vec2Processor.from_pretrained("airesearch/wav2vec2-large-xlsr-53-th")
    model = Wav2Vec2ForCTC.from_pretrained("airesearch/wav2vec2-large-xlsr-53-th")
    
    return processor, model

def transcribe_audio(audio_file_path, processor, model):
    """
    Transcribe Thai speech from an audio file
    
    Args:
        audio_file_path: Path to the audio file (wav, mp3, etc.)
        processor: Wav2Vec2Processor for the Thai model
        model: Wav2Vec2ForCTC model for Thai
        
    Returns:
        Transcribed text
    """
    # Load audio file (resampling to 16kHz which is required by wav2vec2)
    speech_array, sampling_rate = librosa.load(audio_file_path, sr=16000)
    
    # Preprocess the audio data
    inputs = processor(speech_array, sampling_rate=16000, return_tensors="pt", padding=True)
    
    # Get logits from the model - don't use attention_mask
    with torch.no_grad():
        logits = model(inputs.input_values).logits
    
    # Get predicted ids
    predicted_ids = torch.argmax(logits, dim=-1)
    
    # Convert ids to text
    transcription = processor.batch_decode(predicted_ids)
    
    return transcription[0]

def Speechtotext(audio_file):
    # Example usage
    processor, model = load_model()
    
    
    # Get transcription
    transcription = transcribe_audio(audio_file, processor, model)
    return transcription

