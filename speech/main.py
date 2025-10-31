from fastapi import FastAPI, File, UploadFile

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

from transcribe import transcribe
import shutil
@app.post("/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...)):
    with open("sample", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"transcription": transcribe("sample")}


from emotion import load_audio_to_mono16k, classify_pnn_hf, HF_MODEL
@app.post("/emotion")
async def emotion_endpoint(file: UploadFile = File(...)):
    raw = await file.read()
    y, sr = load_audio_to_mono16k(raw, target_sr=16000)
    if len(y) < 0.4 * sr:
        return {"label": "Neutral", "reason": "audio too short (<0.4s)", "model": HF_MODEL}
    label, dist = classify_pnn_hf(y, sr)
    return {"label": label, "distribution": dist, "model": HF_MODEL}