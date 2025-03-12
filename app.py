from flask import Flask, render_template, request, jsonify
import os
from ThaiserEmotionModel import Thaiser
app = Flask(__name__, template_folder="templates", static_folder="static")


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
    
    audio_path = os.path.join("uploads", audio_file.filename)
    
    try:
        # Read file content into memory
        file_content = audio_file.read()
        # print(file_content)
        # Ensure directory exists
        os.makedirs(os.path.dirname(audio_path), exist_ok=True)
        

        # Save the file content
        with open(audio_path, 'wb+') as f:
            f.write(file_content)
        
        # Verify file was saved
        if not os.path.exists(audio_path):
            raise IOError(f"Failed to save file to {audio_path}")

        # Process the audio file
        result = Thaiser(audio_path)
        print("=====================================")
        print(result)
        # Remove the file after processing
        os.remove(audio_path)

        return jsonify({
            "message": "Emotion recognized successfully",
            "probabilities": {
                "anger": result['confidence_scores'][0],
                "frustration": result['confidence_scores'][1],
                "happiness": result['confidence_scores'][2],
                "neutral": result['confidence_scores'][3],
                "sadness": result['confidence_scores'][4],
            }
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