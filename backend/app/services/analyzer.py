import json

from app.services.gemini import GeminiClient


class ResumeAnalyzer:
    """
    Service responsible for analyzing resumes
    against job descriptions using AI.
    """

    def __init__(self):
        self.gemini = GeminiClient()

    def analyze_resume(
        self,
        resume_text: str,
        job_description: str
    ) -> dict:

        prompt = f"""
You are an ATS Resume Expert.

Compare the following resume with the job description.

Return ONLY valid JSON.

Format:

{{
    "resume_score": 0,
    "job_match_score": 0,
    "matched_skills": [],
    "missing_skills": [],
    "strengths": [],
    "suggestions": []
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

        response = self.gemini.generate(prompt)

        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        return json.loads(response)