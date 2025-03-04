from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(__name__, template_folder="templates", static_folder="static")

HEADERS = {"Authorization": f"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"}
API_URL = "https://router.huggingface.co/hf-inference/v1"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    audio_file = request.files["file"]
    audio_path = os.path.join("uploads", audio_file.filename)
    audio_file.save(audio_path)

    with open(audio_path, "rb") as f:
        response = requests.post(API_URL, headers=HEADERS, data=f)

    try:
        result = response.json()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
