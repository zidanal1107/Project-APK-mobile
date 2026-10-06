from google import genai
from app.config import settings
from app.prompts.chat_prompts import build_chat_prompt

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_response(self, message: str, context: str = "") -> str:
        # Panggil prompt generator dari file terpisah
        prompt = build_chat_prompt(user_message=message, context=context)

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text

gemini_service = GeminiService()