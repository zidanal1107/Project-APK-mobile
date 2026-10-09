from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = ""

class ChatResponse(BaseModel):
    reply: str