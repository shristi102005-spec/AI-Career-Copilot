# 🚀 AI Career Copilot

An AI-powered Resume Analyzer & Cover Letter Generator that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS), compare them against job descriptions, and generate AI-assisted cover letters.

---

## 📸 Dashboard

![Dashboard](screenshots/day12-working-dashboard.png)

---

## ✨ Features

- 📄 Upload Resume (PDF)
- 🎯 ATS Resume Score
- 🤝 Job Match Score
- ✅ Matched Skills Detection
- ❌ Missing Skills Identification
- 💡 Personalized Resume Suggestions
- ✉️ AI Cover Letter Generator *(In Progress)*
- ⚡ FastAPI REST Backend
- 🎨 Next.js + Tailwind CSS Frontend

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python

### AI / ML
- Resume Analysis Engine
- ATS Skill Matching
- PDF Parsing
- Prompt Engineering (Upcoming)

### Tools
- Git & GitHub
- VS Code

---

## 📂 Project Structure

```text
AI-Career-Copilot
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── services/
│   └── main.py
│
├── frontend/
│   ├── app/
│   ├── services/
│   └── public/
│
├── screenshots/
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/shristi102005-spec/AI-Career-Copilot.git
```

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🚀 How It Works

1. Upload your Resume (PDF)
2. Paste a Job Description
3. Click **Analyze Resume**
4. View:
   - Resume Score
   - Job Match Score
   - Matched Skills
   - Missing Skills
   - Resume Suggestions
5. Generate an AI-powered Cover Letter *(Coming Soon)*

---

## 📈 Roadmap

- [x] Resume Upload
- [x] ATS Resume Analysis
- [x] Job Match Score
- [x] Skill Matching
- [x] Resume Suggestions
- [ ] AI Cover Letter Generator
- [ ] Interview Question Generator
- [ ] Resume Bullet Rewriter
- [ ] PDF Export
- [ ] Authentication
- [ ] Deployment on Vercel & Render

---

## 👩‍💻 Author

**Shristi**

B.Tech (Electronics Engineering - AI & ML)

Building AI-powered applications using FastAPI, Next.js, Python, and Generative AI.

GitHub:
https://github.com/shristi102005-spec

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.