import json

from app.services.gemini import GeminiClient


class InterviewQuestionEngine:
    """
    Generates interview questions based on
    resume + job description.
    """

    def __init__(self):
        self.gemini = GeminiClient()

    def generate_questions(
        self,
        resume_text: str,
        job_description: str
    ) -> dict:

        prompt = f"""
You are an AI Technical Interviewer.

Based on the following Resume and Job Description,
generate interview questions.

Rules:
- Do NOT generate answers.
- Questions should be realistic.
- Suitable for internship interviews.
- Return ONLY valid JSON.

Format:

{{
    "hr_questions": [],
    "technical_questions": [],
    "python_questions": [],
    "sql_questions": [],
    "ml_questions": [],
    "dsa_questions": []
}}

Resume:

{resume_text}

Job Description:

{job_description}
"""

        response_text = self.gemini.generate(prompt)

        if isinstance(response_text, dict):
            return response_text

        response_text = response_text.strip()
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

        try:
            return json.loads(response_text)

        except json.JSONDecodeError:
            return {
                "error": True,
                "message": "Gemini returned invalid JSON."
            }