from flask import Flask, render_template, request, jsonify
import os
from ThaiserEmotionModel import Thaiser
# from wav2vec2 import Speechtotext  
from whisper import inference
app = Flask(__name__, template_folder="templates", static_folder="static")


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/record", methods=["POST"])
def record_audio():
    try:
        # Get the transcript data from the JSON request
        data = request.get_json()
        transcript = data.get('transcript', '')
        
        # Print the received transcript to the terminal
        print(f"Received speech transcript: {transcript}")
        

        return jsonify({
            "transcript": transcript,
            "wav2vec2": transcript,  # Replace with actual model output
            "whisper": transcript,   # Replace with actual model output
        })
    except Exception as e:
        print(f"Error processing speech transcript: {str(e)}")
        return jsonify({
            "error": f"Error processing speech: {str(e)}"
        }), 400
    

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
        resultemotion = Thaiser(audio_path)
        print("=====================================")
        print(resultemotion)
        resultText = inference(audio_path)
        print("=====================================")
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