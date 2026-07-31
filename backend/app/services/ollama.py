import json
import re
import requests


class OllamaClient:

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "qwen2.5:7b"

    def _normalize_keys(self, data):

        normalized = {}

        mapping = {
            "ats score": "ats_score",
            "keyword match": "keyword_match",
            "skills score": "skills_score",
            "experience score": "experience_score",
            "format score": "format_score",
            "tailored summary": "tailored_summary",
            "tailored skills": "tailored_skills",
            "tailored projects": "tailored_projects",
            "changes made": "changes",
            "changes": "changes"
        }

        for key, value in data.items():

            k = key.strip().lower()

            if k in mapping:
                normalized[mapping[k]] = value
            else:
                normalized[k.replace(" ", "_")] = value

        normalized.setdefault("ats_score", 0)
        normalized.setdefault("keyword_match", 0)
        normalized.setdefault("skills_score", 0)
        normalized.setdefault("experience_score", 0)
        normalized.setdefault("format_score", 0)

        normalized.setdefault("tailored_summary", "")
        normalized.setdefault("tailored_skills", [])
        normalized.setdefault("tailored_projects", [])
        normalized.setdefault("changes", [])

        return normalized

    def generate(self, prompt: str):

        try:

            response = requests.post(
                self.url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.2,
                        "num_predict": 2048
                    }
                },
                timeout=180
            )

            response.raise_for_status()

            result = response.json()

            text = result.get("response", "").strip()

            print("\n========== RAW OLLAMA RESPONSE ==========")
            print(text)
            print("=========================================\n")

            text = text.replace("```json", "")
            text = text.replace("```", "").strip()

            match = re.search(r"\{.*\}", text, re.DOTALL)

            if match:
                text = match.group(0)

            data = json.loads(text)

            data = self._normalize_keys(data)

            print("\n========== NORMALIZED RESPONSE ==========")
            print(data)
            print("=========================================\n")

            return data

        except Exception as e:

            print("Ollama Error:", e)

            return {
                "ats_score": 0,
                "keyword_match": 0,
                "skills_score": 0,
                "experience_score": 0,
                "format_score": 0,
                "tailored_summary": "",
                "tailored_skills": [],
                "tailored_projects": [],
                "changes": [],
                "error": str(e)
            }