import os
import shutil
import tempfile

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import FileResponse

from app.services.parser import (
    extract_text_from_pdf,
    extract_text_from_docx
)

from app.services.analyzer import ResumeAnalyzer
from app.services.tailoring_engine import ResumeTailoringEngine
from app.services.resume_builder import ResumeBuilder

router = APIRouter()

analyzer = ResumeAnalyzer()
tailoring_engine = ResumeTailoringEngine()
builder = ResumeBuilder()


def extract_resume_text(file: UploadFile):
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

    return analyzer.analyze_resume(
        resume_text=text,
        job_description=job_description
    )


@router.post("/tailor-resume")
async def tailor_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    filename = file.filename.lower()

    # ===========================
    # DOCX FLOW
    # ===========================

    if filename.endswith(".docx"):

        temp_dir = tempfile.mkdtemp()

        input_docx = os.path.join(
            temp_dir,
            file.filename
        )

        with open(input_docx, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        with open(input_docx, "rb") as f:
            resume_text = extract_text_from_docx(f)

        tailored_data = tailoring_engine.tailor_resume(
            resume_text=resume_text,
            job_description=job_description
        )

        os.makedirs("generated", exist_ok=True)

        output_docx = "generated/Tailored_Resume.docx"

        builder.build_resume(
            input_docx_path=input_docx,
            tailored_data=tailored_data,
            output_path=output_docx
        )
        
        # Re-analyze the tailored resume to get the real ATS score
        

        with open(output_docx, "rb") as f:
            tailored_resume_text = extract_text_from_docx(f)
            
        print("=========== Extracted Tailored Resume ===========")
        print(tailored_resume_text)
        print("===============================================")


       
        print("===== TAILORED DATA =====")
        print(tailored_data)
        print("=========================")

        return {
            "ats_score": tailored_data.get("ats_score"),
            "tailored_summary": tailored_data.get("tailored_summary"),
            "tailored_skills": tailored_data.get("tailored_skills"),
            "tailored_projects": tailored_data.get("tailored_projects"),
            "changes": tailored_data.get("changes"),
            "download_docx": "/download/tailored_resume",
            "download_pdf": "/download/tailored_resume_pdf"
        }

    # ===========================
    # PDF FLOW
    # ===========================

    try:
        resume_text = extract_text_from_pdf(file.file)

    except Exception as e:
        return {
            "error": True,
            "message": str(e)
        }

    tailored_data = tailoring_engine.tailor_resume(
        resume_text=resume_text,
        job_description=job_description
    )
    
    # Re-analyze the tailored resume to get real ATS score

    return {
       "ats_score": tailored_data.get("ats_score"),
       "tailored_summary": tailored_data.get("tailored_summary"),
       "tailored_skills": tailored_data.get("tailored_skills"),
       "tailored_projects": tailored_data.get("tailored_projects"),
       "changes": tailored_data.get("changes"),
    }
 
   

# ===========================
# DOWNLOAD DOCX
# ===========================

@router.get("/download/tailored_resume")
async def download_tailored_resume():

    return FileResponse(
        path="generated/Tailored_Resume.docx",
        filename="Tailored_Resume.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


# ===========================
# DOWNLOAD PDF
# ===========================

@router.get("/download/tailored_resume_pdf")
async def download_tailored_resume_pdf():

    return FileResponse(
        path="generated/Tailored_Resume.pdf",
        filename="Tailored_Resume.pdf",
        media_type="application/pdf"
    )