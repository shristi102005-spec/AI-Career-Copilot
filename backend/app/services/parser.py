import pdfplumber
from docx import Document


class PDFParser:
    """
    Utility class for extracting text from PDF resumes.
    """

    def extract_text(self, file) -> str:
        text = ""

        with pdfplumber.open(file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text


class DOCXParser:
    """
    Utility class for extracting text from DOCX resumes.
    """

    def extract_text(self, file) -> str:

        document = Document(file)

        text = ""

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

        return text


# -----------------------
# PDF Function
# -----------------------

def extract_text_from_pdf(file):
    parser = PDFParser()
    return parser.extract_text(file)


# -----------------------
# DOCX Function
# -----------------------

def extract_text_from_docx(file):
    parser = DOCXParser()
    return parser.extract_text(file)