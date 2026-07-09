from fastapi import FastAPI
from app.api.resume import router as resume_router
from app.api.cover_letter import router as cover_letter_router

app = FastAPI(
    title="AI Career Copilot API",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Career Copilot"
    }

app.include_router(resume_router)
app.include_router(cover_letter_router)