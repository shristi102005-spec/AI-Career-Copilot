from docx import Document
from typing import Dict


class ResumeTemplateEngine:

    def __init__(self, template_path: str):
        self.template_path = template_path

    def generate_resume(
        self,
        tailored_data: Dict,
        output_path: str,
    ):

        doc = Document(self.template_path)

        for paragraph in doc.paragraphs:

            text = paragraph.text.strip()

            if text == "{{SUMMARY}}":
                paragraph.text = tailored_data.get("summary", "")

            elif text == "{{SKILLS}}":
                paragraph.text = " | ".join(
                    tailored_data.get("skills", [])
                )

            elif text == "{{PROJECTS}}":

                projects = tailored_data.get("projects", [])

                project_text = ""

                for project in projects:

                    project_text += (
                        f"{project['title']}\n"
                        f"{project['technologies']}\n"
                    )

                    for bullet in project["description"]:
                        project_text += f"• {bullet}\n"

                    project_text += "\n"

                paragraph.text = project_text

        doc.save(output_path)

        return output_path