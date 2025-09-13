from flask import Flask, render_template, request, jsonify
import os
import flask
from ThaiserEmotionModel import Thaiser
# from wav2vec2 import Speechtotext  
from whisper import Speechtotext
# from sr import Speechtotext
from imagegen import generate_image
from flask_cors import CORS
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    audio_file = request.files["file"]
    
    # Check if transcript was provided by client
    # client_transcript = request.form.get("transcript", "")
    
    # Debug: print file details
    print(f"Filename: {audio_file.filename}")
    print(f"Content Type: {audio_file.content_type}")
    # print(f"Client Transcript: {client_transcript if client_transcript else 'Not provided'}")
    
    # Ensure the uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    
    # Use original filename
    audio_path = os.path.join("uploads", audio_file.filename)
    
    try:
        # Read file content into memory
        file_content = audio_file.read()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(audio_path), exist_ok=True)
        
        # Save the file content
        with open(audio_path, 'wb+') as f:
            f.write(file_content)
        
        # Verify file was saved
        if not os.path.exists(audio_path):
            raise IOError(f"Failed to save file to {audio_path}")
        
        # Process the audio file for emotion analysis
        resultemotion = Thaiser(audio_path)
        print("=====================================")
        print(resultemotion)
        
        # Use client transcript if available, otherwise use speech-to-text
        # if client_transcript:
        #     resultText = client_transcript
        #     print("Using client-side transcript")
        # else:
        resultText = Speechtotext(audio_path)
        print("Using server-side speech-to-text")
        
        print("=====================================")
        print(f"Transcript: {resultText}")
        
        # Generate image based on transcript
        resultimgUrl = generate_image(resultText)
        
        # Remove the file after processing
        os.remove(audio_path)
        
        return jsonify({
            "message": "Emotion recognized successfully",
            "probabilities": {
                "anger": resultemotion['confidence_scores'][0],
                "frustration": resultemotion['confidence_scores'][1],
                "happiness": resultemotion['confidence_scores'][2],
                "neutral": resultemotion['confidence_scores'][3],
                "sadness": resultemotion['confidence_scores'][4],
            },
            "transcript": resultText,
            "image": resultimgUrl
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