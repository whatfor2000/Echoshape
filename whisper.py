from transformers import WhisperForConditionalGeneration, WhisperProcessor
import librosa

device = "cpu" # cpu, cuda

model = WhisperForConditionalGeneration.from_pretrained("juierror/whisper-base-thai").to(device)
processor = WhisperProcessor.from_pretrained("juierror/whisper-base-thai", language="Thai", task="transcribe")

path = "test/0Anger.wav"

def inference(path: str) -> str:
    """
    Get the transcription from audio path

    Args:
        path(str): path to audio file (can be load with librosa)

    Returns:
        str: transcription
    """
    audio, sr = librosa.load(path, sr=16000)
    input_features = processor(audio, sampling_rate=16000, return_tensors="pt").input_features
    generated_tokens = model.generate(
        input_features=input_features.to(device),
        max_new_tokens=255,
        language="Thai"
    ).cpu()
    transcriptions = processor.tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)
    return transcriptions[0]

# print(inference(path=path))
