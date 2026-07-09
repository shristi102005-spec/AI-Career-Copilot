from fastapi import APIRouter, UploadFile, File, Form

from app.services.parser import extract_text_from_pdf
from app.services.analyzer import ResumeAnalyzer

router = APIRouter()

analyzer = ResumeAnalyzer()


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    text = extract_text_from_pdf(file.file)

    analysis = analyzer.analyze_resume(
        resume_text=text,
        job_description=job_description
    )

    return analysis