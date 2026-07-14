from fastapi import APIRouter, UploadFile, File, Form

from app.services.parser import extract_text_from_pdf
from app.services.interview_engine import InterviewQuestionEngine

router = APIRouter()

interview_engine = InterviewQuestionEngine()


@router.post("/generate-interview-questions")
async def generate_interview_questions(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    resume_text = extract_text_from_pdf(file.file)

    result = interview_engine.generate_questions(
        resume_text=resume_text,
        job_description=job_description
    )

    return result