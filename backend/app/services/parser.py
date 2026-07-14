import pdfplumber


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


# Backward-compatible function
def extract_text_from_pdf(file):
    parser = PDFParser()
    return parser.extract_text(file)