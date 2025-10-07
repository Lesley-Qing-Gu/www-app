# Voice Emotion Detection Demo (FastAPI + Frontend)

A minimal working demo for Speech Emotion Recognition.  
The frontend records voice in the browser and sends it to a FastAPI backend,  
which classifies the emotion as Positive / Negative / Neutral using a pre-trained Hugging Face model.

---

## Project Structure

Test/
├─ backend/
│   └─ server.py
└─ frontend/
    └─ index.html

---

## Backend Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn soundfile librosa python-multipart
python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
python -m pip install transformers
```

Start the backend server:
```bash
uvicorn backend.server:app --reload --port 8001
```

Test the API:
```
http://localhost:8001/docs
```

---

## Frontend Setup

```bash
cd frontend
python -m http.server 5500
```

Then open:
```
http://localhost:5500/index.html
```

If your backend uses another port, edit this line in `frontend/index.html`:
```js
const API = 'http://localhost:8001/ser/predict';
```

---

## How It Works

1. The frontend records voice using the **MediaRecorder API**.  
2. Audio (.webm or .ogg) is sent via POST to `/ser/predict`.  
3. The backend converts it to 16kHz mono PCM using ffmpeg and librosa.  
4. The model `superb/hubert-base-superb-er` predicts emotion labels.  
5. Labels like `hap`, `neu`, `ang`, `sad` are normalized to:

   | Model Label | Normalized Emotion |
   |--------------|-------------------|
   | happy, surprise | Positive |
   | angry, sad, fear, disgust | Negative |
   | neutral, calm, bored | Neutral |

6. The backend returns a JSON like:
   ```json
   {
     "label": "Positive",
     "distribution": [
       {"raw": "hap", "score": 0.78, "mapped": "Positive"},
       {"raw": "neu", "score": 0.16, "mapped": "Neutral"}
     ],
     "model": "superb/hubert-base-superb-er"
   }
   ```

---

## Quick Start Summary

```bash
# Backend
source .venv/bin/activate
uvicorn backend.server:app --reload --port 8001

# Frontend
cd frontend
python -m http.server 5500

# Open
http://localhost:5500/index.html
```

---

## References

- Model: https://huggingface.co/superb/hubert-base-superb-er  
- Libraries: FastAPI, Uvicorn, Torch, Transformers, Librosa  
