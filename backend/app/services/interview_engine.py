import json

from app.services.gemini import GeminiClient


class InterviewQuestionEngine:
    """
    Generates personalized interview questions
    and suggested answers based on Resume + Job Description.
    """

    def __init__(self):
        self.gemini = GeminiClient()

    def generate_questions(
        self,
        resume_text: str,
        job_description: str
    ) -> dict:

        prompt = f"""
You are a Senior AI Technical Interviewer working at Google, Microsoft and OpenAI.

Your job is to prepare the candidate for interviews.

Based ONLY on the Resume and Job Description below:

Generate ONLY 6 interview questions.

Exactly:

1 HR Question
1 Python Question
1 SQL Question
1 Machine Learning Question
1 DSA Question
1 Project-based Question

For EVERY question you MUST provide:

- easy_answer
- professional_answer

For ONLY the HR question also provide:

star_answer

For every technical question:

"star_answer": null

Never omit any field.

Return ONLY valid JSON.

Format:

{{
    "interview_questions":[
        {{
            "category":"HR",
            "difficulty":"Easy",
            "question":"...",
            "easy_answer":"...",
            "professional_answer":"...",
            "star_answer":{{
                "situation":"...",
                "task":"...",
                "action":"...",
                "result":"..."
            }}
        }},
        {{
            "category":"Python",
            "difficulty":"Medium",
            "question":"...",
            "easy_answer":"...",
            "professional_answer":"...",
            "star_answer":null
        }}
    ]
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
            result = json.loads(response_text)
            return result

        except json.JSONDecodeError:
            return {
                "error": True,
                "message": "Gemini returned invalid JSON.",
                "raw_response": response_text
            }