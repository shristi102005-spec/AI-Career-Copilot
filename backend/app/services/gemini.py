import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_resume(resume_text, job_description):

    prompt = f"""
You are an ATS Resume Expert.

Compare this resume with the job description.

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

    response = model.generate_content(prompt)

    response_text = response.text.strip()

    # Remove markdown if Gemini returns it
    response_text = response_text.replace("```json", "")
    response_text = response_text.replace("```", "")
    response_text = response_text.strip()

    return json.loads(response_text)