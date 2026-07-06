from fastapi import APIRouter, UploadFile, File, Form
from backend.app.services.parser import extract_text_from_pdf
from backend.app.services.gemini import analyze_resume

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    text = extract_text_from_pdf(file.file)

    analysis = analyze_resume(
        resume_text=text,
        job_description=job_description
    )

    return analysis