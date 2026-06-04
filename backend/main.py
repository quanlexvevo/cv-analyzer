from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import anthropic
import pdfplumber
import io
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CV Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


def analyze_cv(cv_text: str) -> dict:
    prompt = f"""
Sen deneyimli bir İK uzmanı ve kariyer koçusun. Aşağıdaki CV'yi detaylıca analiz et.

CV İÇERİĞİ:
{cv_text}

Lütfen aşağıdaki formatta SADECE JSON olarak yanıt ver. Başka hiçbir şey yazma, markdown kullanma, sadece düz JSON:
{{
  "overall_score": <0-100 arası puan>,
  "summary": "<2-3 cümlelik genel değerlendirme>",
  "strengths": [
    "<güçlü yön 1>",
    "<güçlü yön 2>",
    "<güçlü yön 3>"
  ],
  "weaknesses": [
    "<zayıf yön 1>",
    "<zayıf yön 2>",
    "<zayıf yön 3>"
  ],
  "suggestions": [
    "<somut öneri 1>",
    "<somut öneri 2>",
    "<somut öneri 3>",
    "<somut öneri 4>"
  ],
  "missing_sections": [
    "<eksik bölüm (varsa)>"
  ],
  "keywords": [
    "<önemli anahtar kelime 1>",
    "<önemli anahtar kelime 2>"
  ]
}}
"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = message.content[0].text.strip()

    if response_text.startswith("```"):
        response_text = response_text.split("```")[1]
        if response_text.startswith("json"):
            response_text = response_text[4:]

    response_text = response_text.strip()

    start = response_text.find("{")
    end = response_text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("JSON bulunamadı")
    response_text = response_text[start:end]

    return json.loads(response_text)


@app.get("/")
def root():
    return {"message": "CV Analyzer API çalışıyor 🚀"}


@app.post("/analyze")
async def analyze_cv_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Sadece PDF dosyası yükleyebilirsin.")

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Dosya boyutu 5MB'dan büyük olamaz.")

    cv_text = extract_text_from_pdf(file_bytes)
    if not cv_text or len(cv_text) < 50:
        raise HTTPException(status_code=400, detail="PDF'den metin okunamadı veya CV çok kısa.")

    result = analyze_cv(cv_text)
    return result