import whisper

def transcribe(audio_path) -> str:
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]
