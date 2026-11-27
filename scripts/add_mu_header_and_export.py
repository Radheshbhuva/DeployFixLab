import os
import shutil
import zipfile
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

CCE_TEMPLATE = r"c:\Users\RADHESH\Downloads\CCE_Presentation_Report_01CE0514.docx"
DOCX_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\DOCs\14_Deployment\DeployFix_Lab_University_Project_Report.docx"
ARTIFACT_DOCX = r"C:\Users\RADHESH\.gemini\antigravity\brain\0e22baf9-17c7-45ce-a8e3-5be80852c54c\DeployFix_Lab_University_Project_Report.docx"
LOGO_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\scripts\marwadi_logo.png"

NAVY = RGBColor(0x0F, 0x2C, 0x59)
MUTED = RGBColor(0x47, 0x55, 0x69)


def extract_logo():
    with zipfile.ZipFile(CCE_TEMPLATE, "r") as z:
        with z.open("word/media/image1.png") as src, open(LOGO_PATH, "wb") as dst:
            dst.write(src.read())


def add_bottom_border(p, color_hex="CBD5E1", sz="6"):
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), sz)
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), color_hex)
    pBdr.append(bottom)
    pPr.append(pBdr)


def main():
    extract_logo()
    doc = docx.Document(DOCX_PATH)

    # 1. Insert Marwadi University Logo & Official Header at the very top (before P00)
    first_p = doc.paragraphs[0]
    if "Marwadi University" not in doc.paragraphs[1].text and "Marwadi University" not in doc.paragraphs[0].text:
        p_logo = first_p.insert_paragraph_before("")
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(0)
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(LOGO_PATH, width=Inches(2.8))

        p_uni = first_p.insert_paragraph_before("")
        p_uni.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_uni.paragraph_format.space_before = Pt(2)
        p_uni.paragraph_format.space_after = Pt(2)
        r1 = p_uni.add_run("MARWADI UNIVERSITY, RAJKOT")
        r1.bold = True
        r1.font.size = Pt(14)
        r1.font.color.rgb = NAVY

        p_dept = first_p.insert_paragraph_before("")
        p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_dept.paragraph_format.space_before = Pt(0)
        p_dept.paragraph_format.space_after = Pt(10)
        r2 = p_dept.add_run("Faculty of Engineering & Technology  •  Department of Computer Engineering\nCloud Computing Essentials (01CE0514)")
        r2.bold = True
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = MUTED
        add_bottom_border(p_dept, color_hex="0F2C59", sz="8")

    # 2. Update running page header (Pages 2+) to include Marwadi University
    sec = doc.sections[0]
    sec.different_first_page_header_footer = True
    hdr = sec.header
    hdr_p = hdr.paragraphs[0] if hdr.paragraphs else hdr.add_paragraph()
    hdr_p.text = ""
    hdr_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_hdr = hdr_p.add_run("Marwadi University, Rajkot  |  Dept. of Computer Engineering  |  DeployFix Lab (01CE0514)")
    r_hdr.font.size = Pt(8.5)
    r_hdr.font.color.rgb = MUTED
    add_bottom_border(hdr_p, color_hex="CBD5E1", sz="4")

    doc.save(DOCX_PATH)
    shutil.copy2(DOCX_PATH, ARTIFACT_DOCX)
    print("Updated DOCX with Marwadi University header:", DOCX_PATH)


if __name__ == "__main__":
    main()
