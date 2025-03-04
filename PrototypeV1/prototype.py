import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
import sounddevice as sd
import wavio

def record_audio(filename, duration=3, samplerate=22050):
    print("กำลังบันทึกเสียง...")
    audio_data = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='float32')
    sd.wait()
    wavio.write(filename, audio_data, samplerate, sampwidth=2)
    print("บันทึกเสียงเสร็จสิ้น!")

def analyze_audio(filename):
    y, sr = librosa.load(filename, sr=None)
    
    # คำนวณ Spectral Centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    avg_centroid = np.mean(spectral_centroid)
    
    # คำนวณ MFCC (Mel-Frequency Cepstral Coefficients)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    avg_mfccs = np.mean(mfccs, axis=1)
    
    return avg_centroid, avg_mfccs

def generate_visualization(centroid, mfccs):
    plt.figure(figsize=(8, 5))
    
    # ใช้ centroid กำหนดสีของภาพ (โทนเสียงสูง = สีแดง, โทนต่ำ = สีน้ำเงิน)
    color = 'red' if centroid > 3000 else 'blue'
    
    # แสดงผลเป็นวงกลมที่มีสีตามโทนเสียง
    circle = plt.Circle((0.5, 0.5), 0.3, color=color, alpha=0.6)
    ax = plt.gca()
    ax.add_patch(circle)
    plt.xlim(0, 1)
    plt.ylim(0, 1)
    plt.axis('off')
    plt.title(f"Visualization of Sound (Centroid: {int(centroid)} Hz)")
    
    plt.show()

if __name__ == "__main__":
    audio_file = "recorded_audio.wav"
    record_audio(audio_file)
    centroid, mfccs = analyze_audio(audio_file)
    generate_visualization(centroid, mfccs)
