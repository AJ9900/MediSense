"""
MediSense Python FastAPI AI Microservice - Main Entry Point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from services.triage_service import analyze_triage
from services.ml_waiting_time_service import predict_waiting_time
from services.chatbot_service import generate_chatbot_response
from services.report_summarizer_service import summarize_medical_report

app = FastAPI(
    title="MediSense AI Microservice",
    description="Intelligent Triage, ML Waiting Time Prediction, Report Summarization & Hospital Chatbot",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Payload Schemas
class TriageRequest(BaseModel):
    symptoms: str
    age: Optional[int] = None
    gender: Optional[str] = None

class WaitingTimeRequest(BaseModel):
    queueLength: int
    department: str
    hourOfDay: Optional[int] = 10
    doctorExp: Optional[int] = 10

class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class ReportRequest(BaseModel):
    reportText: str

@app.get("/")
def read_root():
    return {"message": "MediSense Python AI Microservice Online", "docs": "/docs"}

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "MediSense Python FastAPI AI Microservice",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": True
    }

@app.post("/ai/triage")
def triage_endpoint(req: TriageRequest):
    return analyze_triage(req.symptoms, req.age, req.gender)

@app.post("/ai/predict-waiting-time")
def waiting_time_endpoint(req: WaitingTimeRequest):
    return predict_waiting_time(req.queueLength, req.department, req.hourOfDay, req.doctorExp)

@app.post("/ai/chat")
def chat_endpoint(req: ChatRequest):
    return generate_chatbot_response(req.query, req.language)

@app.post("/ai/summarize-report")
def summarize_endpoint(req: ReportRequest):
    return summarize_medical_report(req.reportText)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
