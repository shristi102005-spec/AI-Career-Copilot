from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.resume import router as resume_router
from app.api.cover_letter import router as cover_letter_router
from app.api import interview 
from app.api.interview_answer import router as interview_answer_router

app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0"
)

# Allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Career Copilot"
    }

app.include_router(resume_router)
app.include_router(cover_letter_router)
app.include_router(interview.router)
app.include_router(interview_answer_router)