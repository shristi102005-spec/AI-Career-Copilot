from fastapi import APIRouter, UploadFile, File, Form

from app.services.parser import extract_text_from_pdf
from app.services.cover_letter_generator import CoverLetterGenerator

router = APIRouter()

generator = CoverLetterGenerator()


@router.post("/generate-cover-letter")
async def generate_cover_letter(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    company_name: str = Form(default="")
):
    resume_text = extract_text_from_pdf(file.file)

    return generator.generate_cover_letter(
        resume_text=resume_text,
        job_description=job_description,
        company_name=company_name if company_name else None,
    )