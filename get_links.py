import sys

try:
    import fitz
    doc = fitz.open("CV_Harsh_Raj_12309410.pdf")
    for page in doc:
        for link in page.get_links():
            print(link.get("uri"))
    sys.exit(0)
except Exception as e:
    print("PyMuPDF error:", e)

try:
    from PyPDF2 import PdfReader
    reader = PdfReader("CV_Harsh_Raj_12309410.pdf")
    for page in reader.pages:
        if "/Annots" in page:
            for annot in page["/Annots"]:
                obj = annot.get_object()
                if "/A" in obj and "/URI" in obj["/A"]:
                    print(obj["/A"]["/URI"])
    sys.exit(0)
except Exception as e:
    print("PyPDF2 error:", e)

print("Could not extract links.")
