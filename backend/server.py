from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import io, os, tempfile, subprocess
import numpy as np
import soundfile as sf
import librosa
from transformers import pipeline

# ------------- FastAPI app -------------
app = FastAPI(title="Voice → P/N/N Emotion API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)

# ------------- HF model pipeline -------------
# You can change to: "speechbrain/emotion-recognition-wav2vec2-IEMOCAP"
HF_MODEL = "superb/hubert-base-superb-er"
clf = pipeline("audio-classification", model=HF_MODEL)

# Map raw labels to Positive / Negative / Neutral
LABEL_MAP = {
    "ang": "Negative",
    "fea": "Negative",
    "dis": "Negative",
    "sad": "Negative",
    "hap": "Positive",
    "sur": "Positive",
    "neu": "Neutral",
    "cal": "Neutral",
    "bor": "Neutral"
}

# ------------- Audio loading with ffmpeg fallback -------------
def load_audio_to_mono16k(raw: bytes, target_sr=16000):
    """
    Read arbitrary audio bytes and return mono 16 kHz PCM.
    Try soundfile -> librosa -> ffmpeg (handles webm/ogg/mp3/m4a).
    """
    # 1) Try soundfile
    try:
        y, sr = sf.read(io.BytesIO(raw), always_2d=False)
        if y.ndim > 1:
            y = y.mean(axis=1)
    except Exception:
        y, sr = None, None

    # 2) Try librosa if needed
    if y is None:
        try:
            y, sr = librosa.load(io.BytesIO(raw), sr=None, mono=True)
        except Exception:
            y, sr = None, None

    # 3) Fallback to ffmpeg
    if y is None:
        with tempfile.NamedTemporaryFile(suffix=".bin", delete=False) as fin:
            fin.write(raw)
            fin.flush()
            in_path = fin.name
        out_path = in_path + ".wav"
        try:
            # Requires ffmpeg installed and in PATH
            subprocess.check_call(
                ["ffmpeg", "-y", "-i", in_path, "-ac", "1", "-ar", str(target_sr), out_path],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            y, sr = sf.read(out_path, always_2d=False)
            if y.ndim > 1:
                y = y.mean(axis=1)
        finally:
            try:
                os.remove(in_path)
                if os.path.exists(out_path):
                    os.remove(out_path)
            except Exception:
                pass

    # Resample if needed
    if sr != target_sr:
        y = librosa.resample(y, orig_sr=sr, target_sr=target_sr)
        sr = target_sr

    # Light normalize and simple silence trimming
    y = librosa.util.normalize(y)
    intervals = librosa.effects.split(y, top_db=25)
    if len(intervals):
        y = np.concatenate([y[s:e] for s, e in intervals])

    return y.astype(np.float32), sr

def classify_pnn_hf(y: np.ndarray, sr: int, threshold: float = 0.50):
    """
    Run pre-trained SER model and map labels to Positive/Negative/Neutral.
    If top score < threshold, return Neutral.
    """
    results = clf(y, sampling_rate=sr)
    mapped = []
    for r in results:
        raw_lab = r["label"].lower()
        pnn = LABEL_MAP.get(raw_lab, "Neutral")
        mapped.append({"raw": raw_lab, "score": float(r["score"]), "mapped": pnn})

    if not mapped:
        return "Neutral", mapped

    top = max(mapped, key=lambda x: x["score"])
    label = top["mapped"] if top["score"] >= threshold else "Neutral"
    return label, mapped

# ------------- Routes -------------
@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs", "endpoint": "/ser/predict", "model": HF_MODEL}

@app.post("/ser/predict")
async def predict(file: UploadFile = File(...)):
    raw = await file.read()
    y, sr = load_audio_to_mono16k(raw, target_sr=16000)
    if len(y) < 0.4 * sr:
        return {"label": "Neutral", "reason": "audio too short (<0.4s)", "model": HF_MODEL}
    label, dist = classify_pnn_hf(y, sr)
    return {"label": label, "distribution": dist, "model": HF_MODEL}
