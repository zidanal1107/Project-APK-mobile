from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

app = FastAPI(
    title="A Day In Campus - AI Service",
    description="Microservice AI untuk Chatbot (Gemini) & Computer Vision (YOLO11n)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(chat.router)
# app.include_router(vision.router)
# app.include_router(intent.router)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AI Microservice Active"}