from app.services.gemini import GeminiClient


class CoverLetterGenerator:
    def __init__(self):
        self.gemini = GeminiClient()

    def generate_cover_letter(
        self,
        resume_text: str,
        job_description: str,
        company_name: str | None = None,
    ):
        prompt = f"""
You are an expert recruiter and professional career coach.

Write a professional, ATS-friendly cover letter.

Candidate Resume:
{resume_text}

Job Description:
{job_description}

Company:
{company_name if company_name else "Not specified"}

Instructions:
- Write a professional cover letter.
- Keep it between 250 and 350 words.
- Mention ONLY skills, projects and experiences present in the resume.
- Never invent work experience, certifications or projects.
- Align the candidate's strengths with the job description.
- If a required skill is missing, express willingness to learn instead of claiming experience.
- Use a confident and professional tone.
- Return ONLY the cover letter text.
"""

        cover_letter = self.gemini.generate(prompt)

        return {
            "cover_letter": cover_letter,
            "word_count": len(cover_letter.split())
        }