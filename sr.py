import speech_recognition as sr
# too slow

def Speechtotext(audio_file_path):
    r = sr.Recognizer()

    hellow=sr.AudioFile(audio_file_path)
    with hellow as source:
        audio = r.record(source)
    try:
        s = r.recognize_google(audio,language='th')
        print("Text: "+s)
        return s
    except Exception as e:
        print("Exception: "+str(e))