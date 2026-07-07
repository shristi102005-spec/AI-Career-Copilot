import json

from app.services.gemini import GeminiClient


class ResumeTailoringEngine:
    """
    Service responsible for tailoring resumes
    according to job descriptions using AI.
    """

    def __init__(self):
        self.gemini = GeminiClient()


    def tailor_resume(
        self,
        resume_text: str,
        job_description: str
    ) -> dict:
        """
        Takes resume text and job description,
        returns tailored resume suggestions.
        """

        prompt = f"""
You are an ATS Resume Expert.

Your task is to improve the resume according to the job description.

Rules:
- Never invent experience.
- Never invent internships.
- Never invent certifications.
- Only improve wording.
- Add ATS keywords only if they match existing experience.

Return ONLY valid JSON.

Format:

{{
    "ats_score": 0,
    "tailored_summary": "",
    "tailored_projects": [],
    "changes": []
}}

Resume:

{resume_text}


Job Description:

{job_description}
"""

        response_text = self.gemini.generate(prompt)

        response_text = response_text.strip()

        # Remove markdown if Gemini returns JSON inside code block
        response_text = response_text.replace("```json", "")
        response_text = response_text.replace("```", "")
        response_text = response_text.strip()

        result = json.loads(response_text)

        return result