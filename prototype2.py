import librosa
import numpy as np
import sounddevice as sd
import wavio
import requests
from flask import Flask, render_template, request, jsonify, send_from_directory
import matplotlib.pyplot as plt
import io
import base64
import os
import matplotlib.colors as mcolors
import librosa.display
import threading

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

API_URL = "https://router.huggingface.co/hf-inference/v1"
HEADERS = {"Authorization": "Echoshape"}

def query_api(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=HEADERS, data=data)
    return response.json()

def record_audio(filename, duration=3, samplerate=22050):
    print("กำลังบันทึกเสียง...")
    audio_data = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='float32')
    sd.wait()
    wavio.write(filename, audio_data, samplerate, sampwidth=2)
    print("บันทึกเสียงเสร็จสิ้น!")

def analyze_audio(filename):
    y, sr = librosa.load(filename, sr=None)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    avg_centroid = np.mean(spectral_centroid)
    min_freq = np.min(spectral_centroid)
    max_freq = np.max(spectral_centroid)
    return avg_centroid, min_freq, max_freq, spectral_centroid

def generate_visualization(centroid, min_freq, max_freq):
    plt.figure(figsize=(5, 5))
    norm = plt.Normalize(min_freq, max_freq)
    cmap = plt.get_cmap("coolwarm")
    color = cmap(norm(centroid))
    hex_color = mcolors.to_hex(color)
    
    circle = plt.Circle((0.5, 0.5), 0.3, color=hex_color, alpha=0.8)
    ax = plt.gca()
    ax.add_patch(circle)
    plt.xlim(0, 1)
    plt.ylim(0, 1)
    plt.axis('off')
    plt.title(f"Sound Visualization (Centroid: {int(centroid)} Hz)")
    
    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    img_base64 = base64.b64encode(img.getvalue()).decode()
    return img_base64

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        centroid, min_freq, max_freq, spectral_data = analyze_audio(filename)
        api_analysis = query_api(filename)
        img_base64 = generate_visualization(centroid, min_freq, max_freq)
        return jsonify({"image": img_base64, "centroid": centroid, "min_freq": min_freq, "max_freq": max_freq, "audio": filename, "spectral_data": spectral_data.tolist(), "api_analysis": api_analysis})
    return jsonify({"error": "No file uploaded"})

@app.route('/record', methods=['POST'])
def record():
    filename = os.path.join(app.config['UPLOAD_FOLDER'], "recorded_audio.wav")
    record_audio(filename, duration=3)
    return jsonify({"message": "Recording complete", "audio": "recorded_audio.wav"})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
