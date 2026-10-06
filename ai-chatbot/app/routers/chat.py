from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/chat", tags=["Chatbot AI"])

@router.post("", response_model=ChatResponse)
async def handle_chat(payload: ChatRequest):
    try:
        reply_text = gemini_service.generate_response(
            message=payload.message,
            context=payload.context
        )
        return ChatResponse(reply=reply_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Processing Error: {str(e)}")