import os

import google.generativeai as genai
from dotenv import load_dotenv

from app.services.ollama import OllamaClient

load_dotenv()


class GeminiClient:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        self.ollama = OllamaClient()
        self.gemini_available = False

        if api_key:
            try:
                genai.configure(api_key=api_key)

                self.model = genai.GenerativeModel(
                    "gemini-2.5-flash"
                )

                self.gemini_available = True

            except Exception:
                self.gemini_available = False

    def optimize_prompt(self, prompt: str) -> str:
        """
        Compress prompt for Ollama.
        Gemini still receives the full prompt.
        """

        if len(prompt) > 5000:
            prompt = prompt[:5000]

        prompt += """

IMPORTANT:
Return ONLY valid JSON.
Do not explain anything.
Do not use markdown.
Do not use ```json.
"""

        return prompt

    def generate(self, prompt: str):

        # ---------- Try Gemini First ----------
        if self.gemini_available:

            try:
                response = self.model.generate_content(prompt)
                return response.text

            except Exception as e:
                print("Gemini failed.")
                print(e)

        # ---------- Ollama Fallback ----------
        print("Using Ollama...")

        short_prompt = self.optimize_prompt(prompt)

        return self.ollama.generate(short_prompt)