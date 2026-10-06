from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = ""  # Data jadwal/user yang dikirim oleh TS Backend

class ChatResponse(BaseModel):
    reply: str