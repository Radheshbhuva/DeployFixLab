import os
import shutil
import zipfile
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

CCE_TEMPLATE = r"c:\Users\RADHESH\Downloads\CCE_Presentation_Report_01CE0514.docx"
LOGO_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\scripts\marwadi_logo.png"
FIG_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\scripts\fig_12_1_aws_arch.png"
OUT_DOCX = r"c:\House_of_Growth\DeployFix_Lab-Trial\DOCs\14_Deployment\DeployFix_Lab_Final_Report.docx"
ART_DOCX = r"C:\Users\RADHESH\.gemini\antigravity\brain\0e22baf9-17c7-45ce-a8e3-5be80852c54c\DeployFix_Lab_Final_Report.docx"

BLACK = RGBColor(0x00, 0x00, 0x00)
NAVY = RGBColor(0x1F, 0x4E, 0x79)
FONT_NAME = "Times New Roman"

PROJECT_TITLE_UPPER = "DEPLOYFIX LAB: CLOUD INCIDENT RESPONSE & SRE DEPLOYMENT PLATFORM"
PROJECT_TITLE = "DeployFix Lab: Cloud Incident Response & SRE Deployment Platform"
STUDENT_NAME = "Radhesh Bhuva"
STUDENT_NAME_UPPER = "RADHESH BHUVA"
ENROLLMENT_NO = "[Enrollment No.]"


def extract_logo():
    if not os.path.exists(LOGO_PATH):
        with zipfile.ZipFile(CCE_TEMPLATE, "r") as z:
            with z.open("word/media/image1.png") as src, open(LOGO_PATH, "wb") as dst:
                dst.write(src.read())


def set_run_font(r, bold=False, italic=False, size_pt=11.5, color=BLACK):
    r.bold = bold
    r.italic = italic
    r.font.name = FONT_NAME
    r.font.size = Pt(size_pt)
    r.font.color.rgb = color


def add_p(doc, text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, bold=False, italic=False, size_pt=11.5, color=BLACK, space_before=0, space_after=5, line_spacing=1.15, page_break_before=False):
    p = doc.add_paragraph()
    p.alignment = align
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    if page_break_before:
        pf.page_break_before = True
    if text:
        r = p.add_run(text)
        set_run_font(r, bold=bold, italic=italic, size_pt=size_pt, color=color)
    return p


def add_bullet(doc, text, lead=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.left_indent = Inches(0.35)
    pf.first_line_indent = Inches(-0.18)
    pf.space_before = Pt(1)
    pf.space_after = Pt(3)
    pf.line_spacing = 1.15
    r_b = p.add_run("•  ")
    set_run_font(r_b, bold=True, size_pt=11.5)
    if lead:
        r_l = p.add_run(lead + ": ")
        set_run_font(r_l, bold=True, size_pt=11.5)
    r_t = p.add_run(text)
    set_run_font(r_t, bold=False, size_pt=11.5)
    return p


def add_numbered(doc, num, text, lead=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    pf = p.paragraph_format
    pf.left_indent = Inches(0.35)
    pf.first_line_indent = Inches(-0.22)
    pf.space_before = Pt(2)
    pf.space_after = Pt(4)
    pf.line_spacing = 1.15
    r_n = p.add_run(f"{num}. ")
    set_run_font(r_n, bold=False, size_pt=11.5)
    if lead:
        r_l = p.add_run(lead + ": ")
        set_run_font(r_l, bold=True, size_pt=11.5)
    r_t = p.add_run(text)
    set_run_font(r_t, bold=False, size_pt=11.5)
    return p


def add_chapter(doc, num_str, title_str, page_break=True):
    add_p(doc, f"CHAPTER {num_str}", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=15, space_before=4, space_after=6, page_break_before=page_break)
    add_p(doc, title_str, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=15, space_before=2, space_after=10)


def add_section_heading(doc, title):
    add_p(doc, title, align=WD_ALIGN_PARAGRAPH.LEFT, bold=True, size_pt=13, space_before=10, space_after=4)


def add_front_title(doc, title):
    add_p(doc, title, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=15, space_before=4, space_after=10, page_break_before=True)


def set_cell_shading(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill_hex)
    tcPr.append(shd)


def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement("w:tcMar")
    for m, val in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        node = OxmlElement(f"w:{m}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        tcMar.append(node)
    tcPr.append(tcMar)


def set_table_borders(table):
    tblPr = table._tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for border_name in ["top", "left", "bottom", "right", "insideH", "insideV"]:
        border = OxmlElement(f"w:{border_name}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "4")
        border.set(qn("w:space"), "0")
        border.set(qn("w:color"), "000000")
        borders.append(border)
    tblPr.append(borders)


def add_styled_table(doc, headers, rows, col_widths=None):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)

    # Repeat header row across pages
    trPr = table.rows[0]._tr.get_or_add_trPr()
    trPr.append(OxmlElement("w:tblHeader"))

    for c_idx, h_text in enumerate(headers):
        cell = table.rows[0].cells[c_idx]
        if col_widths:
            cell.width = Inches(col_widths[c_idx])
        set_cell_shading(cell, "E3EAF3")
        set_cell_margins(cell)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h_text)
        set_run_font(r, bold=True, size_pt=10.5)

    for r_idx, row_data in enumerate(rows):
        for c_idx, val in enumerate(row_data):
            cell = table.rows[r_idx + 1].cells[c_idx]
            if col_widths:
                cell.width = Inches(col_widths[c_idx])
            set_cell_margins(cell)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.1
            r = p.add_run(val)
            set_run_font(r, bold=False, size_pt=10)

    add_p(doc, "", space_before=0, space_after=4)
    return table


def add_page_number_field(paragraph):
    run = paragraph.add_run()
    set_run_font(run, bold=False, size_pt=11)
    fldChar1 = OxmlElement("w:fldChar")
    fldChar1.set(qn("w:fldCharType"), "begin")
    instrText = OxmlElement("w:instrText")
    instrText.set(qn("xml:space"), "preserve")
    instrText.text = "PAGE"
    fldChar2 = OxmlElement("w:fldChar")
    fldChar2.set(qn("w:fldCharType"), "separate")
    fldChar3 = OxmlElement("w:fldChar")
    fldChar3.set(qn("w:fldCharType"), "end")
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)


def configure_headers_and_footers(doc):
    sec = doc.sections[0]
    sec.top_margin = Inches(0.45)
    sec.bottom_margin = Inches(0.70)
    sec.left_margin = Inches(0.90)
    sec.right_margin = Inches(0.90)
    sec.header_distance = Inches(0.25)
    sec.footer_distance = Inches(0.35)
    sec.different_first_page_header_footer = True

    # Pages 2+ Running Header: Marwadi University NAAC A+ logo + 5-line university block
    hdr = sec.header
    p_logo = hdr.paragraphs[0]
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(0)
    p_logo.paragraph_format.space_after = Pt(4)
    p_logo.add_run().add_picture(LOGO_PATH, width=Inches(2.55))

    hdr_lines = [
        ("Cloud Computing Essentials (01CE0514)", True),
        ("Department of Computer Engineering", False),
        ("Faculty of Engineering & Technology", True),
        ("Marwadi University", True),
        ("A.Y. 2026-27", True),
    ]
    for text, is_bold in hdr_lines:
        p = hdr.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(1)
        r = p.add_run(text)
        set_run_font(r, bold=is_bold, size_pt=12.5)

    # Footers (both first page & subsequent pages): centered page number
    for ftr in [sec.first_page_footer, sec.footer]:
        fp = ftr.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_page_number_field(fp)


def main():
    extract_logo()
    doc = docx.Document()

    # Base Normal style
    normal = doc.styles["Normal"]
    normal.font.name = FONT_NAME
    normal.font.size = Pt(11.5)
    normal.font.color.rgb = BLACK

    configure_headers_and_footers(doc)

    # =========================================================
    # PAGE 1: COVER PAGE
    # =========================================================
    for text, is_bold in [
        ("Cloud Computing Essentials (01CE0514)", True),
        ("Department of Computer Engineering", False),
        ("Faculty of Engineering & Technology", True),
        ("Marwadi University", True),
        ("A.Y. 2026-27", True),
    ]:
        add_p(doc, text, align=WD_ALIGN_PARAGRAPH.CENTER, bold=is_bold, size_pt=13, space_before=0, space_after=3)

    add_p(doc, "", space_after=24)
    add_p(doc, PROJECT_TITLE_UPPER, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=16, space_after=14)
    add_p(doc, "A PROJECT REPORT", align=WD_ALIGN_PARAGRAPH.CENTER, bold=False, size_pt=13, space_after=10)
    add_p(doc, "Cloud Computing Essentials (01CE0514)", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=14, space_after=24)

    add_p(doc, "Submitted by", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, italic=True, size_pt=12, space_after=8)
    add_p(doc, STUDENT_NAME_UPPER, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=14, space_after=4)
    add_p(doc, ENROLLMENT_NO, align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=12, space_after=18)

    add_p(doc, "BACHELOR OF TECHNOLOGY", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=14, space_after=4)
    add_p(doc, "in", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, italic=True, size_pt=12, space_after=4)
    add_p(doc, "Computer Engineering", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=12, space_after=14)

    p_cover_logo = add_p(doc, "", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=14)
    p_cover_logo.add_run().add_picture(LOGO_PATH, width=Inches(3.2))

    add_p(doc, "Faculty of Engineering & Technology", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=12, space_after=3)
    add_p(doc, "Marwadi University, Rajkot", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=12, space_after=8)
    add_p(doc, "November, 2026", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=11, space_after=0)

    # =========================================================
    # PAGE 2: CERTIFICATE
    # =========================================================
    add_front_title(doc, "CERTIFICATE")
    p_cert = add_p(doc, "", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size_pt=11.5, space_after=48)
    for txt, b in [
        ("This is to certify that the project report submitted along with the project entitled “", False),
        (PROJECT_TITLE, False),
        (f"” has been carried out by {STUDENT_NAME} (Enrollment No. {ENROLLMENT_NO}) under my guidance in partial fulfilment for the subject of Bachelor of Technology in Computer Engineering, 5th Semester of Marwadi University, Rajkot during the academic year 2026-27.", False),
    ]:
        r = p_cert.add_run(txt)
        set_run_font(r, bold=b, size_pt=11.5)

    # Clean 2-column borderless signature table for Certificate
    sig_tbl = doc.add_table(rows=4, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_data = [
        ("____________________", "____________________"),
        ("Prof. Pranav Tank", "Prof. (Dr.) Krunal Vaghela"),
        ("Assistant Professor", "Associate Dean & Head"),
        ("Department of Computer Engineering", "Department of Computer Engineering"),
    ]
    for r_i, (left_t, right_t) in enumerate(sig_data):
        for c_i, val in enumerate([left_t, right_t]):
            cell = sig_tbl.rows[r_i].cells[c_i]
            cell.width = Inches(3.3)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(val)
            set_run_font(r, bold=False, size_pt=11.5)

    # =========================================================
    # PAGE 3: DECLARATION
    # =========================================================
    add_front_title(doc, "DECLARATION")
    add_p(
        doc,
        f"I hereby declare that the Cloud Computing Essentials (01CE0514) report submitted with the project entitled “{PROJECT_TITLE}” in partial fulfilment for the subject of Bachelor of Technology in Computer Engineering to Marwadi University, Rajkot, is a bona fide record of original work carried out by me at Marwadi University under the supervision of Prof. Pranav Tank. The report describes the live AWS cloud deployment and implementation contained in the supplied project source files. Any external material used for general technical explanation is acknowledged in the references.",
        align=WD_ALIGN_PARAGRAPH.JUSTIFY,
        size_pt=11.5,
        space_after=48,
    )

    decl_tbl = doc.add_table(rows=2, cols=2)
    decl_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for c_i, val in enumerate(["Name of the Student", "Sign of Student"]):
        p = decl_tbl.rows[0].cells[c_i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(12)
        set_run_font(p.add_run(val), bold=False, size_pt=11.5)
    for c_i, val in enumerate([STUDENT_NAME, "____________________"]):
        p = decl_tbl.rows[1].cells[c_i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        set_run_font(p.add_run(val), bold=False, size_pt=11.5)

    # =========================================================
    # PAGE 4: ACKNOWLEDGEMENT
    # =========================================================
    add_front_title(doc, "ACKNOWLEDGEMENT")
    add_p(
        doc,
        "I express my sincere gratitude to the faculty members of the Department of Computer Engineering, Marwadi University, for their guidance and support during the completion of this project. I am thankful to my internal guide, Prof. Pranav Tank, and our Associate Dean & Head, Prof. (Dr.) Krunal Vaghela, for providing valuable suggestions and direction throughout the cloud deployment and documentation process.",
        space_after=10,
    )
    add_p(
        doc,
        "I also acknowledge the contribution of the open-source technologies and cloud platforms used in DeployFix Lab, including Amazon Web Services (AWS EC2, EBS, VPC, CloudFormation), Docker, NGINX, Node.js, React, PostgreSQL, Redis, and Prisma ORM. Finally, I thank my family and friends for their encouragement and support.",
        space_after=10,
    )

    # =========================================================
    # PAGE 5: ABSTRACT
    # =========================================================
    add_front_title(doc, "ABSTRACT")
    add_p(
        doc,
        "DeployFix Lab is an interactive Site Reliability Engineering (SRE) and cloud incident response simulation platform deployed end-to-end on Amazon Web Services (AWS) within the 12-Month Free Tier ($0.00/month cost footprint). The platform enables platform administrators, instructors, and student engineers to simulate authentic production failures, inspect live telemetry, and practice structured incident recovery workflows.",
        space_after=10,
    )
    add_p(
        doc,
        "The application is built as a three-tier containerized microservices stack using React 18 (Vite + TailwindCSS) for the frontend, Node.js 20 with Express and TypeScript for the REST and WebSocket backend, PostgreSQL 16 managed via Prisma ORM for persistent relational storage, and Redis 7 for ephemeral chaos state. All four containers are orchestrated via Docker Compose on an Ubuntu 24.04 LTS Amazon EC2 instance (ap-southeast-2, Sydney) behind an NGINX reverse proxy.",
        space_after=10,
    )
    add_p(
        doc,
        "Public ingress is routed through a custom GoDaddy subdomain (https://deployfixlab.devlinktech.online) mapped via DNS A-record to Public IPv4 16.179.57.228 with automated Let's Encrypt TLS/SSL termination. This report documents the objectives, requirements, system architecture, database design, modules, testing cases, security hardening, and real-world production troubleshooting resolutions achieved during live AWS deployment.",
        space_after=10,
    )

    # =========================================================
    # PAGE 6: ABBREVIATIONS
    # =========================================================
    add_front_title(doc, "ABBREVIATIONS")
    add_styled_table(
        doc,
        ["Abbreviation", "Full Form / Meaning"],
        [
            ["AWS", "Amazon Web Services"],
            ["EC2", "Amazon Elastic Compute Cloud"],
            ["EBS", "Amazon Elastic Block Store"],
            ["VPC", "Virtual Private Cloud"],
            ["NGINX", "Engine-X High-Performance Reverse Proxy"],
            ["SRE", "Site Reliability Engineering"],
            ["RBAC", "Role-Based Access Control"],
            ["CORS", "Cross-Origin Resource Sharing"],
            ["JWT", "JSON Web Token"],
            ["ORM", "Object-Relational Mapping"],
            ["DNS", "Domain Name System"],
            ["HTTP / HTTPS", "Hypertext Transfer Protocol / Secure"],
            ["SSL / TLS", "Secure Sockets Layer / Transport Layer Security"],
            ["REST", "Representational State Transfer"],
            ["SPA", "Single Page Application"],
            ["CRUD", "Create, Read, Update and Delete"],
            ["OOM", "Out of Memory"],
            ["UFW", "Uncomplicated Firewall"],
            ["IaC", "Infrastructure as Code"],
            ["CI/CD", "Continuous Integration / Continuous Deployment"],
        ],
        col_widths=[1.8, 4.9],
    )

    # =========================================================
    # PAGE 7: TABLE OF CONTENTS
    # =========================================================
    add_front_title(doc, "TABLE OF CONTENTS")
    add_styled_table(
        doc,
        ["Chapter / Section", "Page"],
        [
            ["Certificate", "2"],
            ["Declaration", "3"],
            ["Acknowledgement", "4"],
            ["Abstract", "5"],
            ["Abbreviations", "6"],
            ["Table of Contents", "7"],
            ["Chapter 1 – Introduction", "8"],
            ["Chapter 2 – Objectives and Scope", "9"],
            ["Chapter 3 – Technology Stack and Development Environment", "10"],
            ["Chapter 4 – System Analysis and Requirements", "11"],
            ["Chapter 5 – System Architecture and Design", "12"],
            ["Chapter 6 – Database & Cache Design", "13"],
            ["Chapter 7 – Module Description", "14"],
            ["Chapter 8 – Implementation Details", "15"],
            ["Chapter 9 – Testing and Validation", "16"],
            ["Chapter 10 – Security, Constraints and Limitations", "17"],
            ["Chapter 11 – Future Enhancements", "18"],
            ["Chapter 12 – Live AWS Cloud Deployment Architecture", "19"],
            ["Chapter 13 – Conclusion", "22"],
            ["References", "23"],
            ["Appendices", "24"],
        ],
        col_widths=[5.4, 1.3],
    )
    add_p(
        doc,
        "Note: Page references are indicative and correspond to the Microsoft Word PDF export.",
        align=WD_ALIGN_PARAGRAPH.LEFT,
        italic=True,
        size_pt=9.5,
    )

    # =========================================================
    # CHAPTER 1 – INTRODUCTION
    # =========================================================
    add_chapter(doc, "1", "INTRODUCTION")
    add_section_heading(doc, "1.1 Background")
    add_p(
        doc,
        "Modern cloud-native applications rely on distributed microservices, container orchestration, and reverse-proxy ingress layers. When failures occur in production—such as container crash loops, database connection errors, or cross-origin authentication failures—engineers must diagnose logs and restore service rapidly. DeployFix Lab provides a controlled, live cloud environment designed to train and evaluate Site Reliability Engineering (SRE) incident response workflows.",
    )
    add_section_heading(doc, "1.2 Project Overview")
    add_p(
        doc,
        "DeployFix Lab is organized as a full-stack modular monorepo containing a React 18 frontend, a Node.js 20 TypeScript Express backend, PostgreSQL 16 relational persistence via Prisma ORM, and Redis 7 state caching. The entire stack is containerized with Docker Compose and deployed live on Amazon EC2 (ap-southeast-2) behind an NGINX reverse proxy with custom GoDaddy subdomain routing at https://deployfixlab.devlinktech.online.",
    )
    add_section_heading(doc, "1.3 Problem Statement")
    add_p(
        doc,
        "Traditional academic cloud assignments often remain theoretical or local-only, leaving students unprepared for real-world deployment issues such as 1 GB RAM OOM kills, Alpine Linux OpenSSL library mismatches, Docker bridge DNS isolation, and browser cookie security policies. This project solves that gap by both building an incident-simulation platform and deploying it to live AWS Free Tier infrastructure.",
    )
    add_section_heading(doc, "1.4 Intended Users")
    add_bullet(doc, "Manages chaos control, injects simulated failures, oversees user registry, and holds full SRE privileges.", lead="Platform Admin (admin@deployfix.lab)")
    add_bullet(doc, "Authors incident scenarios, monitors student progress, and provisions laboratory exercises.", lead="Lead Instructor (instructor@deployfix.lab)")
    add_bullet(doc, "Executes guided incident recovery labs, inspects diagnostic telemetry, and verifies system health.", lead="Student Engineer (student@deployfix.lab)")
    add_section_heading(doc, "1.5 Report Basis")
    add_p(
        doc,
        "This report documents the implemented source code in the DeployFixLab repository along with the verified live AWS EC2 deployment (16.179.57.228), GoDaddy DNS configuration, NGINX reverse-proxy setup, and four real production incidents diagnosed and resolved during deployment.",
    )

    # =========================================================
    # CHAPTER 2 – OBJECTIVES AND SCOPE
    # =========================================================
    add_chapter(doc, "2", "OBJECTIVES AND SCOPE")
    add_section_heading(doc, "2.1 Objectives")
    add_bullet(doc, "Deploy a production-grade 3-tier web application on Amazon Web Services strictly within the 12-Month Free Tier ($0.00/month).")
    add_bullet(doc, "Configure custom subdomain routing (deployfixlab.devlinktech.online) via GoDaddy DNS A-records without disrupting existing root-domain sites.")
    add_bullet(doc, "Implement Role-Based Access Control (RBAC) across Admin, Instructor, and Student personas using JWT and HTTP cookies.")
    add_bullet(doc, "Provide real-time chaos failure injection, diagnostic verification, and live WebSocket log streaming.")
    add_bullet(doc, "Harden Linux host memory (4 GB swapfile) and dual-layer firewalls (AWS Security Groups + Ubuntu UFW).")

    add_section_heading(doc, "2.2 Scope of the Current Version")
    add_p(
        doc,
        "The live deployment covers end-to-end authentication, RBAC dashboards, chaos failure injection, task and lab scenario management, repository diagnostics, audit logging, and automated health checks accessible over HTTPS (deployfixlab.devlinktech.online) and HTTP (16.179.57.228).",
    )

    add_section_heading(doc, "2.3 Out of Scope / Future Work")
    add_bullet(doc, "Multi-region active-active failover across multiple AWS availability zones or regions.")
    add_bullet(doc, "Managed Kubernetes (Amazon EKS) horizontal pod autoscaling.")
    add_bullet(doc, "External Prometheus/Grafana metrics scraping outside the built-in telemetry dashboard.")

    add_section_heading(doc, "2.4 Expected Outcome")
    add_p(
        doc,
        "A publicly accessible, zero-cost AWS cloud deployment demonstrating containerization, reverse-proxy TLS termination, custom DNS routing, and authentic SRE incident postmortems.",
    )

    # =========================================================
    # CHAPTER 3 – TECHNOLOGY STACK AND DEVELOPMENT ENVIRONMENT
    # =========================================================
    add_chapter(doc, "3", "TECHNOLOGY STACK AND DEVELOPMENT ENVIRONMENT")
    add_section_heading(doc, "3.1 Technologies Identified in the Project")
    add_styled_table(
        doc,
        ["Technology", "Evidence / Purpose"],
        [
            ["React 18 + Vite + TailwindCSS", "Single Page Application (SPA) frontend UI and interactive SRE dashboards."],
            ["Node.js 20 + TypeScript + Express", "Modular monolith REST API and WebSocket server running on port 5000."],
            ["Prisma ORM", "Type-safe database client, schema migrations, and automated seed scripts."],
            ["PostgreSQL 16 Alpine", "Primary relational database storing users, scenarios, chaos states, and audit logs."],
            ["Redis 7 Alpine", "In-memory cache for ephemeral chaos state and rate limiting."],
            ["NGINX Alpine", "Edge reverse proxy handling static assets, /api & /ws proxying, and TLS termination."],
            ["Docker & Docker Compose", "Multi-container orchestration across isolated bridge network deployfix-network."],
            ["AWS EC2 + Cloud-Init + IaC", "Ubuntu 24.04 LTS cloud compute in ap-southeast-2 with automated provisioning."],
        ],
        col_widths=[2.2, 4.5],
    )

    add_section_heading(doc, "3.2 Development Environment")
    add_p(
        doc,
        "The repository is structured under Application/frontend and Application/backend with unified Dockerfiles and docker-compose.yml orchestration. Local development uses TypeScript compilation, Zod schema validation, and Prisma migrations, while production builds run multi-stage Alpine Docker images.",
    )

    add_section_heading(doc, "3.3 Application Configuration")
    add_p(
        doc,
        "Environment configuration is injected via Docker Compose environment variables and .env files, routing DATABASE_URL to postgres:5432 and REDIS_URL to redis:6379. The Express app enables dynamic CORS origin reflection and request-aware cookie security (isRequestSecure) to support both HTTPS custom domains and direct HTTP IP access.",
    )

    # =========================================================
    # CHAPTER 4 – SYSTEM ANALYSIS AND REQUIREMENTS
    # =========================================================
    add_chapter(doc, "4", "SYSTEM ANALYSIS AND REQUIREMENTS")
    add_section_heading(doc, "4.1 Functional Requirements")
    add_bullet(doc, "The system shall authenticate users via email/password and issue signed JWT access and refresh tokens.")
    add_bullet(doc, "The system shall enforce RBAC permissions distinguishing Admin, Instructor, and Student roles.")
    add_bullet(doc, "The system shall allow Admins to inject and resolve simulated chaos failures.")
    add_bullet(doc, "The system shall allow Instructors to author lab scenarios and monitor student recovery progress.")
    add_bullet(doc, "The system shall stream real-time diagnostic logs and verification results to authenticated clients.")
    add_bullet(doc, "The system shall expose a /api/health endpoint verifying backend, PostgreSQL, and Redis readiness.")

    add_section_heading(doc, "4.2 Non-Functional Requirements")
    add_bullet(doc, "All four containers must operate reliably within 1 GB physical RAM + 4 GB swap on AWS t2/t3.micro.", lead="Resource Efficiency")
    add_bullet(doc, "Backend processes run as non-root user node:node behind UFW and AWS Security Groups.", lead="Security")
    add_bullet(doc, "Dynamic CORS and SameSite=Lax cookie handling ensure seamless browser sessions.", lead="Compatibility")
    add_bullet(doc, "Modular backend directories (auth, chaos, labs, recovery, audit) separate domain concerns.", lead="Maintainability")

    add_section_heading(doc, "4.3 Hardware and Software Requirements")
    add_p(
        doc,
        "Cloud Compute: AWS EC2 t2.micro or t3.micro (1 vCPU, 1 GB RAM, 30 GB EBS GP3, 4 GB Swapfile) running Ubuntu 24.04 LTS with Docker Engine and Docker Compose v2. Client: Any modern web browser over HTTPS/HTTP.",
    )

    add_section_heading(doc, "4.4 Main Use-Case Summary")
    add_styled_table(
        doc,
        ["Actor", "Main Sequence"],
        [
            ["Platform Admin", "Login → Open Chaos Control → Inject Failure → Monitor Telemetry → Audit Logs"],
            ["Lead Instructor", "Login → Author Lab Scenario → Assign Tasks → Review Student Progress"],
            ["Student Engineer", "Login → Select Lab → Inspect Diagnostics → Apply Recovery → Verify Health"],
        ],
        col_widths=[1.8, 4.9],
    )

    # =========================================================
    # CHAPTER 5 – SYSTEM ARCHITECTURE AND DESIGN
    # =========================================================
    add_chapter(doc, "5", "SYSTEM ARCHITECTURE AND DESIGN")
    add_section_heading(doc, "5.1 Architectural Pattern")
    add_p(
        doc,
        "DeployFix Lab follows a three-tier containerized microservices pattern inside an isolated Docker bridge network (deployfix-network). An NGINX ingress layer decouples static frontend delivery from backend API and WebSocket routing, while Prisma ORM abstracts relational SQL operations.",
    )

    add_section_heading(doc, "5.2 High-Level Architecture")
    add_styled_table(
        doc,
        ["Layer", "Components", "Responsibility"],
        [
            ["Ingress / Edge", "NGINX Reverse Proxy (Ports 80/443)", "TLS termination, static SPA serving, /api & /ws proxying."],
            ["Presentation", "React 18, Vite, TailwindCSS", "Interactive UI, RBAC dashboards, live log viewer."],
            ["Application", "Node.js 20, Express, 12 Domain Modules", "REST APIs, JWT auth, chaos engine, diagnostics."],
            ["Data Access", "Prisma ORM + Migrations", "Type-safe queries and schema evolution."],
            ["Storage", "PostgreSQL 16 (pgdata volume)", "Persists users, labs, chaos failures, and audit logs."],
            ["Cache", "Redis 7 Alpine", "Ephemeral chaos state and fast session rate tracking."],
        ],
        col_widths=[1.3, 2.2, 3.2],
    )

    add_section_heading(doc, "5.3 Request and Traffic Flow")
    add_p(
        doc,
        "Incoming requests to https://deployfixlab.devlinktech.online resolve via GoDaddy DNS to 16.179.57.228. AWS Security Groups permit ports 80/443 to reach NGINX, which serves the React bundle or forwards /api/* requests to deployfix-backend:5000. The backend queries postgres:5432 and redis:6379 over internal Docker DNS.",
    )

    add_section_heading(doc, "5.4 Middleware and Startup")
    add_p(
        doc,
        "On container startup, the backend validates environment variables, runs Prisma client initialization against PostgreSQL, registers Helmet security headers, dynamic CORS origin reflection, cookie-parser, JSON parsing, and mounts all 12 domain routers.",
    )

    # =========================================================
    # CHAPTER 6 – DATABASE & CACHE DESIGN
    # =========================================================
    add_chapter(doc, "6", "DATABASE & CACHE DESIGN")
    add_section_heading(doc, "6.1 Main Entities (Prisma Schema)")
    add_styled_table(
        doc,
        ["Entity", "Key Fields", "Purpose"],
        [
            ["User", "id, email, passwordHash, role, createdAt", "Stores Admin, Instructor, and Student accounts."],
            ["RefreshToken", "id, token, userId, expiresAt", "Manages persistent JWT refresh sessions."],
            ["LabScenario", "id, title, difficulty, faultType", "Defines incident simulation scenarios."],
            ["ChaosFailure", "id, scenarioId, status, injectedAt", "Tracks active and resolved chaos injections."],
            ["UserLabProgress", "id, userId, scenarioId, status, score", "Records student completion and recovery metrics."],
            ["VerificationLog / AuditLog", "id, action, actorId, timestamp", "Maintains immutable SRE verification & audit trails."],
        ],
        col_widths=[1.7, 2.3, 2.7],
    )

    add_section_heading(doc, "6.2 Relationship Description")
    add_bullet(doc, "One User can own multiple RefreshTokens, Tasks, UserLabProgress entries, and AuditLogs.")
    add_bullet(doc, "One LabScenario can have multiple ChaosFailures and UserLabProgress records.")
    add_bullet(doc, "Repository, RepositoryScan, ProjectContext, and Diagnostic entities link GitHub analysis to lab diagnostics.")

    add_section_heading(doc, "6.3 Database Migrations & Seed Data")
    add_p(
        doc,
        "Schema evolution is managed via Prisma Migrate and prisma db push during container initialization. Automated seed scripts populate three role-based evaluation accounts (admin@deployfix.lab, instructor@deployfix.lab, student@deployfix.lab) and starter incident scenarios.",
    )

    add_section_heading(doc, "6.4 Data Integrity Considerations")
    add_p(
        doc,
        "PostgreSQL data is persisted on a named Docker volume (pgdata) mapped to the EC2 EBS volume so container rebuilds or restarts never lose database state. Foreign-key constraints and Zod runtime validation prevent malformed payloads from entering the database.",
    )

    # =========================================================
    # CHAPTER 7 – MODULE DESCRIPTION
    # =========================================================
    SHOTS_DIR = r"c:\House_of_Growth\DeployFix_Lab-Trial\scripts\screenshots"

    def add_screenshot(filename, caption):
        img_path = os.path.join(SHOTS_DIR, filename)
        if os.path.exists(img_path):
            p_img = add_p(doc, "", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=4, space_after=3)
            p_img.add_run().add_picture(img_path, width=Inches(5.8))
            add_p(doc, caption, align=WD_ALIGN_PARAGRAPH.CENTER, italic=True, size_pt=10, space_after=8)

    add_chapter(doc, "7", "MODULE DESCRIPTION")

    add_section_heading(doc, "7.1 Landing & Entry Module")
    add_p(doc, "The Landing Module presents the DeployFix Lab v2.0 platform overview, operational status indicator, and navigation entry points for launching the diagnostic sandbox or signing in.")
    add_screenshot("fig_7_1_landing.png", "Figure 7.1: DeployFix Lab landing page interface showcasing multi-source diagnostic overview and live operational status.")

    add_section_heading(doc, "7.2 Auth & RBAC Login Module (auth)")
    add_p(doc, "Handles user registration, login, token refresh, logout, and role-based middleware guards for Platform Admin, Lead Instructor, and Student Engineer accounts.")
    add_screenshot("fig_7_2_login.png", "Figure 7.2: Role-based authentication login interface supporting Admin, Instructor, and Student accounts.")

    add_section_heading(doc, "7.3 Platform Telemetry Dashboard Module (dashboard, health)")
    add_p(doc, "Displays cluster telemetry requests, gateway average latency, cluster error rate, active users, and real-time microservice health probes across Frontend, Backend, PostgreSQL, and NGINX.")
    add_screenshot("fig_7_3_dashboard.png", "Figure 7.3: Platform Fleet Telemetry & Infrastructure Health dashboard displaying cluster metrics and microservice health probes.")

    add_section_heading(doc, "7.4 Chaos Injection Control Module (chaos)")
    add_p(doc, "Simulates controlled production faults (latency spikes, CPU spikes, service crashes) via an interactive Chaos CLI Operator Terminal and tracks active student lab sessions.")
    add_screenshot("fig_7_5_chaos.png", "Figure 7.4: Admin Failure Injection Sandbox & Chaos CLI Operator Terminal for controlled fault injection.")

    add_section_heading(doc, "7.5 Live Log Streaming Module (recovery, evidence)")
    add_p(doc, "Streams container and application telemetry logs in real time with regex/level/service filtering and an interactive telemetry CLI for live incident triage.")
    add_screenshot("fig_7_6_logs.png", "Figure 7.5: Live SRE Telemetry Stream & Interactive CLI for real-time container log inspection.")

    add_section_heading(doc, "7.6 Multi-Source AI Diagnosis Module (diagnosis)")
    add_p(doc, "Correlates website URL health probes, uploaded configuration/log files, and GitHub commit diffs to synthesize deterministic root-cause analysis and remediation steps.")
    add_screenshot("fig_7_7_diagnosis.png", "Figure 7.6: AI Evidence-Based Diagnosis Engine correlating URL probes, file uploads, and GitHub context.")

    add_section_heading(doc, "7.7 Labs, Tasks & RBAC User Management Modules (labs, tasks, admin, audit)")
    add_p(doc, "Provides CRUD operations for incident scenarios, guided recovery steps, role-based user governance (Admin, Instructor, Student), and immutable audit trails.")

    # =========================================================
    # CHAPTER 8 – IMPLEMENTATION DETAILS
    # =========================================================
    add_chapter(doc, "8", "IMPLEMENTATION DETAILS")
    add_section_heading(doc, "8.1 Application Startup & Containerization")
    add_p(
        doc,
        "Docker Compose coordinates four services (deployfix-frontend, deployfix-backend, deployfix-postgres, deployfix-redis) with healthchecks and restart: unless-stopped policies. Multi-stage Dockerfiles minimize final image size for Free Tier storage.",
    )
    add_section_heading(doc, "8.2 JWT & Request-Aware Cookie Handling")
    add_p(
        doc,
        "Authentication cookies use HttpOnly and SameSite=Lax flags. A helper function isRequestSecure(req) inspects req.secure and X-Forwarded-Proto so cookies work seamlessly over both HTTPS (deployfixlab.devlinktech.online) and direct HTTP IP testing.",
    )
    add_section_heading(doc, "8.3 Dynamic CORS Origin Reflection")
    add_p(
        doc,
        "In Application/backend/src/app.ts, CORS dynamically reflects valid request origins with credentials: true, preventing cross-origin rejection when accessed via custom subdomains or EC2 public IPs.",
    )
    add_section_heading(doc, "8.4 Live Seeded Evaluation Credentials")
    add_styled_table(
        doc,
        ["Role", "Email Address", "Password", "Privileges"],
        [
            ["Platform Admin", "admin@deployfix.lab", "Password123!", "Chaos Control, Failure Injection, Full SRE Access"],
            ["Lead Instructor", "instructor@deployfix.lab", "Password123!", "Scenario Authoring, Student Progress Monitoring"],
            ["Student Engineer", "student@deployfix.lab", "Password123!", "Guided Recovery Labs & Live Telemetry"],
        ],
        col_widths=[1.4, 1.9, 1.1, 2.3],
    )

    # =========================================================
    # CHAPTER 9 – TESTING AND VALIDATION
    # =========================================================
    add_chapter(doc, "9", "TESTING AND VALIDATION")
    add_section_heading(doc, "9.1 Testing Approach & Executed Validation Cases")
    add_styled_table(
        doc,
        ["ID", "Test Scenario", "Expected & Verified Result"],
        [
            ["T01", "Access https://deployfixlab.devlinktech.online", "Landing page loads over HTTPS with valid TLS certificate."],
            ["T02", "Access http://16.179.57.228", "Fallback EC2 endpoint serves frontend SPA cleanly."],
            ["T03", "GET /api/health", "Returns HTTP 200 OK with PostgreSQL & Redis status."],
            ["T04", "Login as Admin (admin@deployfix.lab)", "JWT cookie issued; redirects to Admin dashboard without logout loop."],
            ["T05", "Login as Instructor & Student", "RBAC enforces role-specific views and API permissions."],
            ["T06", "Inject Chaos Failure", "Chaos state persists in Redis/PostgreSQL and reflects in UI."],
            ["T07", "Execute Recovery Verification", "VerificationLog records pass/fail and updates progress."],
            ["T08", "Container Restart Resilience", "PostgreSQL pgdata volume preserves all seeded and user records."],
        ],
        col_widths=[0.6, 2.6, 3.5],
    )
    add_section_heading(doc, "9.2 Validation Points")
    add_bullet(doc, "Verified docker compose ps shows all 4 containers healthy.")
    add_bullet(doc, "Verified GoDaddy DNS A-record propagation for deployfixlab.devlinktech.online.")
    add_bullet(doc, "Verified non-admin accounts receive HTTP 403 Forbidden on admin-only endpoints.")

    # =========================================================
    # CHAPTER 10 – SECURITY, CONSTRAINTS AND LIMITATIONS
    # =========================================================
    add_chapter(doc, "10", "SECURITY, CONSTRAINTS AND LIMITATIONS")
    add_section_heading(doc, "10.1 Authentication and Cookie Security")
    add_p(doc, "Passwords are hashed securely, JWT secrets are injected via environment variables outside source control, and session cookies enforce HttpOnly and SameSite=Lax.")
    add_section_heading(doc, "10.2 Firewall & Least Privilege")
    add_p(doc, "Only ports 22, 80, and 443 are exposed externally via AWS Security Groups and Ubuntu UFW. PostgreSQL (5432) and Redis (6379) remain strictly internal to deployfix-network.")
    add_section_heading(doc, "10.3 Free Tier Compute Constraints")
    add_p(doc, "An AWS t2.micro provides 1 GB RAM; therefore, a 4 GB swapfile (vm.swappiness=20) is mandatory to prevent OOM crashes during TypeScript and Vite container builds.")

    # =========================================================
    # CHAPTER 11 – FUTURE ENHANCEMENTS
    # =========================================================
    add_chapter(doc, "11", "FUTURE ENHANCEMENTS")
    add_bullet(doc, "Migrate container orchestration to Amazon EKS (Kubernetes) for horizontal pod autoscaling.")
    add_bullet(doc, "Integrate Prometheus and Grafana dashboards for golden-signal observability (latency, traffic, errors, saturation).")
    add_bullet(doc, "Add automated GitHub Actions CI/CD pipelines for zero-downtime blue-green deployments.")
    add_bullet(doc, "Implement multi-region AWS failover with Route 53 health checks.")
    add_bullet(doc, "Add automated AI-assisted root-cause hint generation inside student recovery labs.")

    # =========================================================
    # CHAPTER 12 – LIVE AWS CLOUD DEPLOYMENT ARCHITECTURE
    # =========================================================
    add_chapter(doc, "12", "LIVE AWS CLOUD DEPLOYMENT ARCHITECTURE")
    add_section_heading(doc, "12.1 Purpose and Live Deployment Status")
    add_p(
        doc,
        "Unlike local-only academic prototypes, DeployFix Lab is actively deployed and running on Amazon Web Services (AWS) in the Asia Pacific (Sydney) region (ap-southeast-2) at Public IPv4 16.179.57.228 and custom domain https://deployfixlab.devlinktech.online.",
    )

    add_section_heading(doc, "12.2 Deployed AWS Architecture")
    add_p(
        doc,
        "External traffic enters via GoDaddy DNS to the AWS EC2 Security Group, passes to NGINX on ports 80/443, and is routed internally across Docker bridge network deployfix-network to the Node.js backend, PostgreSQL 16 database, and Redis 7 cache.",
    )
    add_p(doc, "FIGURE 12.1 – LIVE AWS CLOUD DEPLOYMENT ARCHITECTURE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=11, color=NAVY, space_before=6, space_after=4)
    p_fig = add_p(doc, "", align=WD_ALIGN_PARAGRAPH.CENTER, space_after=4)
    p_fig.add_run().add_picture(FIG_PATH, width=Inches(6.4))
    add_p(
        doc,
        "Figure 12.1: Live AWS EC2 Free Tier deployment topology for DeployFix Lab with GoDaddy DNS, NGINX TLS, and Docker Compose.",
        align=WD_ALIGN_PARAGRAPH.CENTER,
        italic=True,
        size_pt=10,
        space_after=8,
    )

    add_screenshot("fig_12_2_ec2_build.png", "Figure 12.2: Live AWS EC2 (ap-southeast-2) Instance Connect session executing multi-stage Docker Compose container builds.")

    add_section_heading(doc, "12.3 AWS Services and Their Roles")
    add_styled_table(
        doc,
        ["AWS Service", "Configuration", "Free Tier Compliance"],
        [
            ["Amazon EC2", "t2.micro / t3.micro, Ubuntu 24.04 LTS (ap-southeast-2)", "750 hrs/month free (24/7 coverage)"],
            ["Amazon EBS", "30 GB GP3 General Purpose SSD volume", "Up to 30 GB/month free"],
            ["AWS VPC & IPv4", "Default VPC, Public Subnet, IGW, IP 16.179.57.228", "750 hrs/month free public IPv4"],
            ["Security Groups", "Stateful firewall allowing Ports 22, 80, 443", "Included native AWS security"],
            ["CloudFormation & Cloud-Init", "Automated IaC bootstrap and 4 GB swap setup", "Free management service"],
        ],
        col_widths=[1.7, 2.8, 2.2],
    )

    add_section_heading(doc, "12.4 Production Troubleshooting & SRE Case Studies")
    add_numbered(doc, 1, "Backend container entered a Restarting (1) loop because zod was listed in devDependencies and omitted by npm ci --omit=dev. Fixed by moving zod to runtime dependencies in package.json.", lead="Dependency Packaging Failure (zod)")
    add_numbered(doc, 2, "Prisma threw libssl.so.1.1 missing errors on Alpine Linux (OpenSSL 3.0). Fixed by installing openssl and libc6-compat in the Dockerfile and adding linux-musl-openssl-3.0.x to schema.prisma binaryTargets.", lead="Alpine OpenSSL Binary Incompatibility")
    add_numbered(doc, 3, "Migrations failed with P1001 at localhost:5432 because localhost inside a container points to its own loopback. Fixed by routing DATABASE_URL to Docker service hostname postgres:5432.", lead="Docker Bridge DNS Loopback")
    add_numbered(doc, 4, "Users experienced an instant logout redirect loop because CORS only whitelisted localhost and cookies hardcoded secure: true. Fixed with dynamic CORS origin reflection and request-aware isRequestSecure(req).", lead="CORS & Secure Cookie Logout Loop")

    add_section_heading(doc, "12.5 Security, Availability and Cost Considerations")
    add_p(
        doc,
        "By combining AWS Free Tier compute (750 hrs/month), 30 GB EBS, free GoDaddy subdomain DNS routing, and Let's Encrypt TLS certificates, the entire production platform operates at $0.00/month while maintaining TLS encryption, non-root containers, and persistent volume backups.",
    )

    # =========================================================
    # CHAPTER 13 – CONCLUSION
    # =========================================================
    add_chapter(doc, "13", "CONCLUSION")
    add_p(
        doc,
        "DeployFix Lab demonstrates the complete lifecycle of designing, containerizing, hardening, and deploying a production-grade microservices application on Amazon Web Services within the 12-Month Free Tier. Through live EC2 provisioning, GoDaddy subdomain integration (deployfixlab.devlinktech.online), NGINX reverse proxying, and resolving four authentic SRE incidents, the project bridges Cloud Computing Essentials (01CE0514) theory with real-world cloud operations.",
    )

    # =========================================================
    # REFERENCES
    # =========================================================
    add_front_title(doc, "REFERENCES")
    refs = [
        "[1] Amazon Web Services, “Amazon EC2 User Guide for Linux Instances & AWS Free Tier,” AWS Documentation. Available: https://docs.aws.amazon.com/ec2/",
        "[2] Docker, Inc., “Docker Compose Networking & Multi-Stage Builds,” Docker Documentation. Available: https://docs.docker.com/compose/",
        "[3] F5, Inc., “NGINX Reverse Proxy & SSL Termination Guide,” NGINX Documentation. Available: https://nginx.org/en/docs/",
        "[4] Prisma Data, Inc., “Prisma ORM Deployment & Alpine Linux Binary Targets,” Prisma Docs. Available: https://www.prisma.io/docs/",
        "[5] B. Beyer, C. Jones, J. Petoff, and N. R. Murphy, Site Reliability Engineering: How Google Runs Production Systems. O'Reilly Media, 2016.",
        "[6] Let's Encrypt & Certbot, “Automated TLS Certificate Issuance,” EFF Documentation. Available: https://certbot.eff.org/",
    ]
    for ref in refs:
        add_p(doc, ref, align=WD_ALIGN_PARAGRAPH.LEFT, size_pt=11, space_after=6)

    # =========================================================
    # APPENDICES
    # =========================================================
    add_front_title(doc, "APPENDIX A – PROJECT STRUCTURE")
    add_styled_table(
        doc,
        ["Folder / Area", "Important Files / Contents"],
        [
            ["Application/backend/src/modules/", "auth, admin, audit, chaos, dashboard, diagnosis, evidence, github, health, labs, recovery, tasks"],
            ["Application/backend/prisma/", "schema.prisma (13 models), migrations/, seed scripts"],
            ["Application/backend/", "Dockerfile (Alpine Node 20 + OpenSSL 3.0), package.json, tsconfig.json"],
            ["Application/frontend/", "React 18 + Vite + TailwindCSS SPA, nginx.conf, Dockerfile"],
            ["Infrastructure / Root", "docker-compose.yml, CloudFormation YAML, Cloud-Init bootstrap, DOCs/14_Deployment/"],
        ],
        col_widths=[2.3, 4.4],
    )

    add_p(doc, "APPENDIX B – AWS & LIVE DEPLOYMENT OUTLINE", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=14, space_before=14, space_after=8)
    add_bullet(doc, "Provision Ubuntu 24.04 LTS EC2 (t2.micro/t3.micro) in ap-southeast-2 with Security Group ports 22, 80, 443.")
    add_bullet(doc, "Initialize 4 GB swapfile (/swapfile) and configure UFW firewall rules.")
    add_bullet(doc, "Point GoDaddy DNS A-record deployfixlab.devlinktech.online to 16.179.57.228.")
    add_bullet(doc, "Run docker compose up -d --build and verify /api/health returns HTTP 200 OK.")

    add_p(doc, "APPENDIX C – SOURCE FILES & INFRASTRUCTURE REVIEWED", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=14, space_before=14, space_after=8)
    add_p(
        doc,
        "This report was prepared directly from the live DeployFixLab repository (https://github.com/Radheshbhuva/DeployFixLab), including backend/src/app.ts, auth.controller.ts, schema.prisma, docker-compose.yml, NGINX reverse-proxy configs, and verified live EC2 deployment logs.",
    )

    os.makedirs(os.path.dirname(OUT_DOCX), exist_ok=True)
    doc.save(OUT_DOCX)
    shutil.copy2(OUT_DOCX, ART_DOCX)
    print("Generated PDF-styled DOCX:", OUT_DOCX)


if __name__ == "__main__":
    main()
