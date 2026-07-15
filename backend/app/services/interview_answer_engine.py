import json

from app.services.gemini import GeminiClient


class InterviewAnswerEngine:

    def __init__(self):
        self.gemini = GeminiClient()

    def generate_answer(
        self,
        question: str,
        resume_text: str,
        job_description: str
    ):

        prompt = f"""
You are a Senior AI Interview Coach.

Use the Resume and Job Description to answer the interview question.

Rules:

- Never invent experience.
- Never invent projects.
- Never invent internships.
- Keep answers personalized.
- Use simple English.

Return ONLY valid JSON.

Format:

{{
    "easy_answer":"",
    "professional_answer":"",
    "star_answer":{{
        "situation":"",
        "task":"",
        "action":"",
        "result":""
    }}
}}

Interview Question:

{question}

Resume:

{resume_text}

Job Description:

{job_description}
"""

        response = self.gemini.generate(prompt)

        if isinstance(response, dict):
            return response

        response = response.replace("```json", "")
        response = response.replace("```", "").strip()

        try:
            return json.loads(response)

        except:
            return {
                "error": True,
                "message": "Invalid JSON returned."
            }