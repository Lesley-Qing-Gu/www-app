FROM python:3.13

WORKDIR /app

RUN apt update && apt install -y ffmpeg patchelf

# Copy only requirements.txt first (for caching)
COPY requirements.txt .

# Install dependencies
# This layer will be cached *unless* requirements.txt changes
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD uvicorn main:app --reload --host 0.0.0.0