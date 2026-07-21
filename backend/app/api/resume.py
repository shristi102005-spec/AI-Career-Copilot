from fastapi import APIRouter, UploadFile, File, Form

from app.services.parser import (
    extract_text_from_pdf,
    extract_text_from_docx
)
from app.services.analyzer import ResumeAnalyzer
from app.services.tailoring_engine import ResumeTailoringEngine

router = APIRouter()

analyzer = ResumeAnalyzer()
tailoring_engine = ResumeTailoringEngine()


def extract_resume_text(file: UploadFile):
    """
    Automatically extract text from PDF or DOCX.
    """

    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file.file)

    elif filename.endswith(".docx"):
        return extract_text_from_docx(file.file)

    else:
        raise ValueError("Only PDF and DOCX files are supported.")


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    try:
        text = extract_resume_text(file)

    except ValueError as e:
        return {
            "error": True,
            "message": str(e)
        }

    analysis = analyzer.analyze_resume(
        resume_text=text,
        job_description=job_description
    )

    return analysis


@router.post("/tailor-resume")
async def tailor_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    try:
        text = extract_resume_text(file)

    except ValueError as e:
        return {
            "error": True,
            "message": str(e)
        }

    result = tailoring_engine.tailor_resume(
        resume_text=text,
        job_description=job_description
    )

    return result