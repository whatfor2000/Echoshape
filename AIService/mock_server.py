from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)

# Mock emotion probabilities
def mock_emotion():
    emotions = {
        "anger": round(random.uniform(0, 1), 2),
        "frustration": round(random.uniform(0, 1), 2),
        "happiness": round(random.uniform(0, 1), 2),
        "neutral": round(random.uniform(0, 1), 2),
        "sadness": round(random.uniform(0, 1), 2),
    }
    return emotions

# Mock transcript list
mock_transcripts = [
    "Hello, this is a test audio file.",
    "I am just sending this to test the API.",
    "Testing the upload endpoint. Everything looks good.",
    "Cornosoft is the best team in the galaxy.",
]

# Mock image list
mock_images = [
    "https://picsum.photos/300/300",
    "https://placekitten.com/300/300",
    "https://placebear.com/300/300",
    "https://loremflickr.com/320/240",
]


@app.route("/upload", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    audio_file = request.files["file"]

    print(f"Received file: {audio_file.filename}")
    print(f"Content Type: {audio_file.content_type}")

    # Save uploaded file to /uploads for debug (optional)
    os.makedirs("uploads", exist_ok=True)
    audio_path = os.path.join("uploads", audio_file.filename)
    audio_file.save(audio_path)

    # Mock processing
    print("Processing mock emotion & transcript...")

    # --- Mock output ---
    resultemotion = mock_emotion()
    resultText = random.choice(mock_transcripts)
    resultImg = random.choice(mock_images)

    # Delete uploaded file (optional)
    try:
        os.remove(audio_path)
    except:
        pass

    # Return fake response
    return jsonify({
        "message": "Mock emotion recognized successfully",
        "probabilities": resultemotion,
        "transcript": resultText,
        "image": resultImg
    })


@app.route("/")
def home():
    return "Mock AI Service Running on http://localhost:5000", 200


if __name__ == "__main__":
    print("Mock Flask AI Service running on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)
