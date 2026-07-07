import os
import google.generativeai as genai
from dotenv import load_dotenv


load_dotenv()


class GeminiClient:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is missing"
            )

        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )


    def generate(self, prompt: str) -> str:

        response = self.model.generate_content(
            prompt
        )

        return response.text