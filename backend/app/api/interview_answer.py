from fastapi import APIRouter, UploadFile, File, Form

from app.services.parser import extract_text_from_pdf
from app.services.interview_answer_engine import InterviewAnswerEngine

router = APIRouter()

answer_engine = InterviewAnswerEngine()


@router.post("/generate-answer")
async def generate_answer(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    question: str = Form(...)
):
    resume_text = extract_text_from_pdf(file.file)

    result = answer_engine.generate_answer(
        question=question,
        resume_text=resume_text,
        job_description=job_description
    )

    return result