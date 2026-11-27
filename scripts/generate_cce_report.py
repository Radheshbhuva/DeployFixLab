import os
import shutil
import docx
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

TEMPLATE_PATH = r"c:\Users\RADHESH\Downloads\CCE_Presentation_Report_01CE0514.docx"
OUTPUT_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\DOCs\14_Deployment\DeployFix_Lab_CCE_Formatted_Report.docx"
ARTIFACT_PATH = r"C:\Users\RADHESH\.gemini\antigravity\brain\0e22baf9-17c7-45ce-a8e3-5be80852c54c\DeployFix_Lab_CCE_Formatted_Report.docx"

BLACK = RGBColor(0x00, 0x00, 0x00)
PROJECT_TITLE = "DeployFix Lab: Production-Grade SRE & Cloud Incident Response Simulation Platform on AWS"
STUDENT_NAME = "Radhesh Bhuva"
ENROLLMENT_NO = "[Enrollment No.]"


def clear_runs_keep_ppr(p):
    """Remove all run/hyperlink children from a paragraph while keeping pPr (including sectPr)."""
    p_elem = p._p
    for child in list(p_elem):
        if child.tag != qn("w:pPr"):
            p_elem.remove(child)


def add_styled_run(p, text, bold=False, italic=False, size_pt=None, color=BLACK, font_name="Times New Roman"):
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.name = font_name
    if size_pt is not None:
        r.font.size = Pt(size_pt)
    if color is not None:
        r.font.color.rgb = color
    return r


def set_paragraph_segments(p, segments, align=None):
    """Replace paragraph content with formatted run segments while preserving pPr."""
    clear_runs_keep_ppr(p)
    if align is not None:
        p.alignment = align
    for seg in segments:
        text = seg[0]
        bold = seg[1] if len(seg) > 1 else False
        italic = seg[2] if len(seg) > 2 else False
        size_pt = seg[3] if len(seg) > 3 else None
        color = seg[4] if len(seg) > 4 else BLACK
        add_styled_run(p, text, bold=bold, italic=italic, size_pt=size_pt, color=color)


def insert_p_before(anchor_p, text="", style="Body Text", align=None, bold=False, italic=False, size_pt=None, space_before=None, space_after=None, page_break_before=False):
    """Insert a new paragraph immediately before anchor_p."""
    p = anchor_p.insert_paragraph_before("")
    p.style = style
    if align is not None:
        p.alignment = align
    if space_before is not None:
        p.paragraph_format.space_before = Pt(space_before)
    if space_after is not None:
        p.paragraph_format.space_after = Pt(space_after)
    if page_break_before:
        p.paragraph_format.page_break_before = True
    if text:
        add_styled_run(p, text, bold=bold, italic=italic, size_pt=size_pt, color=BLACK)
    return p


def set_cell_shading(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill_hex)
    tcPr.append(shd)


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


def insert_table_before(doc, anchor_p, headers, rows):
    """Create a formatted table and move it immediately before anchor_p."""
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)

    # Header row
    for c_idx, h_text in enumerate(headers):
        cell = table.rows[0].cells[c_idx]
        set_cell_shading(cell, "E8EEF5")
        p = cell.paragraphs[0]
        p.style = "Table Paragraph"
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        add_styled_run(p, h_text, bold=True, size_pt=11)

    # Data rows
    for r_idx, row_data in enumerate(rows):
        for c_idx, val in enumerate(row_data):
            cell = table.rows[r_idx + 1].cells[c_idx]
            p = cell.paragraphs[0]
            p.style = "Table Paragraph"
            p.paragraph_format.space_before = Pt(3)
            p.paragraph_format.space_after = Pt(3)
            add_styled_run(p, val, bold=False, size_pt=10.5)

    # Move table XML before anchor_p
    anchor_p._p.addprevious(table._tbl)
    return table


def remove_paragraph(p):
    p_elem = p._p
    parent = p_elem.getparent()
    if parent is not None:
        parent.remove(p_elem)


def main():
    doc = docx.Document(TEMPLATE_PATH)

    # Capture all paragraph object references upfront before any insertions/removals shift indices
    p_title = doc.paragraphs[1]
    p_student = doc.paragraphs[9]
    p_enroll = doc.paragraphs[10]
    p_date = doc.paragraphs[17]
    p_cert = doc.paragraphs[26]
    p_decl = doc.paragraphs[47]
    ack_anchor = doc.paragraphs[53]
    abs_anchor = doc.paragraphs[58]
    abbr_p1, abbr_p2, abbr_p3 = doc.paragraphs[64], doc.paragraphs[65], doc.paragraphs[66]
    abbr_anchor = doc.paragraphs[67]
    toc_anchor = doc.paragraphs[73]
    chap1_title = doc.paragraphs[77]
    topic1_p = doc.paragraphs[78]
    blank79_p = doc.paragraphs[79]
    chap_anchor = doc.paragraphs[80]

    # ---------------------------------------------------------
    # 1. COVER PAGE (Section 0: P0 - P17)
    # ---------------------------------------------------------
    set_paragraph_segments(p_title, [(PROJECT_TITLE, True, False, 18, BLACK)])
    set_paragraph_segments(p_student, [(STUDENT_NAME, True, False, 16, BLACK)], align=WD_ALIGN_PARAGRAPH.CENTER)
    set_paragraph_segments(p_enroll, [(ENROLLMENT_NO, True, False, 14, BLACK)], align=WD_ALIGN_PARAGRAPH.CENTER)
    set_paragraph_segments(p_date, [("November, 2026", True, False, 12, BLACK)], align=WD_ALIGN_PARAGRAPH.CENTER)

    # ---------------------------------------------------------
    # 2. CERTIFICATE PAGE (Section 1: P19 - P37)
    # ---------------------------------------------------------
    set_paragraph_segments(
        p_cert,
        [
            ("This is to certify that the presentation report submitted along with the topic entitled ", False, False, 14, BLACK),
            (PROJECT_TITLE, True, False, 14, BLACK),
            (" has been carried out by ", False, False, 14, BLACK),
            (f"{STUDENT_NAME} ({ENROLLMENT_NO})", True, False, 14, BLACK),
            (" under my guidance in partial fulfilment for the subject of Bachelor of Technology in Computer Engineering, 5", False, False, 14, BLACK),
            ("th", False, False, 9, BLACK),
            (" Semester of Marwadi University, Rajkot during the academic year 2026-27.", False, False, 14, BLACK),
        ],
        align=WD_ALIGN_PARAGRAPH.JUSTIFY,
    )

    # ---------------------------------------------------------
    # 3. DECLARATION PAGE (Section 2: P39 - P51 + Table 0)
    # ---------------------------------------------------------
    set_paragraph_segments(
        p_decl,
        [
            ("We hereby declare that the ", False, False, 12, BLACK),
            ("Cloud Computing Essentials (01CE0514) ", True, False, 12, BLACK),
            ("report submitted along with the Topic entitled ", False, False, 12, BLACK),
            (PROJECT_TITLE, True, False, 12, BLACK),
            (" submitted in partial fulfilment for the subject of Bachelor of Technology in Computer Engineering to Marwadi University, Rajkot, is a bonafide record of original work carried out by me / us at Marwadi University under the supervision of ", False, False, 12, BLACK),
            ("Prof. Pranav Tank ", True, False, 12, BLACK),
            ("and that no part of this report has been directly copied from any students’ reports or taken from any other source, without providing due reference.", False, False, 12, BLACK),
        ],
        align=WD_ALIGN_PARAGRAPH.JUSTIFY,
    )

    t = doc.tables[0]
    set_paragraph_segments(t.rows[1].cells[0].paragraphs[0], [("1", False, False, 12, BLACK)])
    set_paragraph_segments(t.rows[1].cells[1].paragraphs[0], [(STUDENT_NAME, False, False, 12, BLACK)])
    set_paragraph_segments(t.rows[1].cells[2].paragraphs[0], [("", False, False, 12, BLACK)])
    if len(t.rows) > 2:
        t._tbl.remove(t.rows[2]._tr)

    # ---------------------------------------------------------
    # 4. ACKNOWLEDGEMENT PAGE (Section 3: P52 - P53)
    # ---------------------------------------------------------
    ack_paras = [
        "I would like to express my sincere gratitude to Marwadi University, Rajkot, and the Faculty of Engineering & Technology for providing the academic environment, cloud computing curriculum, and technical resources necessary to design, deploy, and evaluate this project.",
        "I am deeply indebted to my faculty guide, Prof. Pranav Tank, Assistant Professor, Department of Computer Engineering, for his invaluable mentorship, architectural insights, and continuous encouragement throughout the Cloud Computing Essentials (01CE0514) course. I also extend my heartfelt thanks to Prof. (Dr.) Krunal Vaghela, Associate Dean & Head, Department of Computer Engineering, for fostering an industry-aligned engineering culture.",
        "Finally, I acknowledge the support of laboratory staff, open-source maintainers, and my peers whose constructive feedback helped diagnose real-world cloud networking and reliability challenges during the production deployment of DeployFix Lab on Amazon Web Services.",
    ]
    insert_p_before(ack_anchor, "", style="Body Text", space_after=6)
    for txt in ack_paras:
        insert_p_before(ack_anchor, txt, style="Body Text", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size_pt=12, space_after=8)

    # ---------------------------------------------------------
    # 5. ABSTRACT PAGE (Section 4: P57 - P58)
    # ---------------------------------------------------------
    abs_paras = [
        "Modern cloud-native applications demand high availability, fault tolerance, and rapid incident recovery. However, traditional academic environments rarely expose students to authentic production failures such as container crash loops, cross-origin authentication drops, database connection exhaustion, or reverse-proxy misconfigurations. DeployFix Lab addresses this gap as a production-grade Site Reliability Engineering (SRE) and Cloud Incident Response Simulation Platform deployed end-to-end on Amazon Web Services (AWS) within the 12-Month Free Tier ($0.00/month cost footprint).",
        "The platform is architected as a three-tier containerized microservices stack orchestrated via Docker Compose on an Ubuntu Linux Amazon EC2 instance (ap-southeast-2, Sydney). It integrates a React 18 Single Page Application (SPA), a Node.js 20 TypeScript REST & WebSocket backend, a PostgreSQL 16 relational database managed through Prisma ORM, and a Redis 7 cache behind an NGINX reverse proxy. Public ingress is routed through a custom GoDaddy subdomain (https://deployfixlab.devlinktech.online) mapped via DNS A-record to Elastic/Public IPv4 16.179.57.228 with automated Let's Encrypt TLS/SSL termination. This report documents the complete cloud architecture, deployment automation, security hardening, and root-cause resolutions for four real-world production incidents encountered during live AWS deployment.",
    ]
    insert_p_before(abs_anchor, "", style="Body Text", space_after=6)
    for txt in abs_paras:
        insert_p_before(abs_anchor, txt, style="Body Text", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size_pt=12, space_after=8)

    # ---------------------------------------------------------
    # 6. ABBREVIATIONS PAGE (Section 5: P62 - P67)
    # ---------------------------------------------------------
    abbreviations = [
        ("API", "Application Programming Interface"),
        ("AWS", "Amazon Web Services"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("DNS", "Domain Name System"),
        ("EBS", "Amazon Elastic Block Store"),
        ("EC2", "Amazon Elastic Compute Cloud"),
        ("HTTP/S", "Hypertext Transfer Protocol / Secure"),
        ("IaC", "Infrastructure as Code"),
        ("JWT", "JSON Web Token"),
        ("MTTR", "Mean Time to Recovery"),
        ("NGINX", "Engine-X High-Performance Reverse Proxy"),
        ("OOM", "Out of Memory"),
        ("ORM", "Object-Relational Mapping"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SPA", "Single Page Application"),
        ("SRE", "Site Reliability Engineering"),
        ("SSL/TLS", "Secure Sockets Layer / Transport Layer Security"),
        ("UFW", "Uncomplicated Firewall"),
        ("VPC", "Virtual Private Cloud"),
    ]
    for idx, p_obj in enumerate([abbr_p1, abbr_p2, abbr_p3]):
        abbr, full = abbreviations[idx]
        set_paragraph_segments(
            p_obj,
            [(f"{abbr}\t", True, False, 12, BLACK), (full, False, False, 12, BLACK)],
        )
    for abbr, full in abbreviations[3:]:
        p = insert_p_before(abbr_anchor, "", style="Normal", space_after=3)
        add_styled_run(p, f"{abbr}\t", bold=True, size_pt=12)
        add_styled_run(p, full, bold=False, size_pt=12)

    # ---------------------------------------------------------
    # 7. TABLE OF CONTENTS PAGE (Section 6: P72 - P73)
    # ---------------------------------------------------------
    toc_entries = [
        ("Certificate", "ii", True),
        ("Declaration", "iii", True),
        ("Acknowledgement", "iv", True),
        ("Abstract", "v", True),
        ("Abbreviations", "vi", True),
        ("CHAPTER 1: INTRODUCTION & PROJECT OVERVIEW", "1", True),
        ("    1.1 Problem Statement & Background", "1", False),
        ("    1.2 Motivation & Industry Relevance of SRE", "1", False),
        ("    1.3 Objectives & Scope of DeployFix Lab", "2", False),
        ("CHAPTER 2: CLOUD ARCHITECTURE & SYSTEM DESIGN", "3", True),
        ("    2.1 Three-Tier Microservices Topology", "3", False),
        ("    2.2 Component Specifications & Containerization", "3", False),
        ("    2.3 AWS Cloud Infrastructure & Free Tier Compliance", "4", False),
        ("CHAPTER 3: PRODUCTION DEPLOYMENT & NETWORKING", "5", True),
        ("    3.1 EC2 Provisioning, Swap & Firewall Hardening", "5", False),
        ("    3.2 Custom GoDaddy Subdomain & DNS Routing", "5", False),
        ("    3.3 NGINX Reverse Proxy & TLS/SSL Configuration", "6", False),
        ("CHAPTER 4: SRE INCIDENT SIMULATION & CASE STUDIES", "7", True),
        ("    4.1 Incident 1: Dependency Packaging Failure (zod)", "7", False),
        ("    4.2 Incident 2: Alpine OpenSSL Binary Incompatibility", "7", False),
        ("    4.3 Incident 3: Docker Bridge DNS Loopback (localhost vs postgres)", "8", False),
        ("    4.4 Incident 4: CORS Rejection & Secure Cookie Logout Loop", "8", False),
        ("CHAPTER 5: VERIFICATION, TESTING & LIVE DEMONSTRATION", "9", True),
        ("    5.1 Live Endpoints & Evaluation Credentials (RBAC)", "9", False),
        ("    5.2 Health Checks & Functional Verification", "9", False),
        ("CHAPTER 6: CONCLUSION & FUTURE ENHANCEMENTS", "10", True),
        ("    6.1 Summary & Key Learnings", "10", False),
        ("    6.2 Future Roadmap", "10", False),
        ("REFERENCES", "11", True),
    ]
    for title, pg, is_bold in toc_entries:
        p = insert_p_before(toc_anchor, "", style="toc 2", space_before=2, space_after=2)
        add_styled_run(p, f"{title}\t{pg}", bold=is_bold, size_pt=11.5)

    # ---------------------------------------------------------
    # 8. CHAPTERS 1 - 6 (Section 7: P77 - P80)
    # ---------------------------------------------------------
    set_paragraph_segments(
        chap1_title,
        [("CHAPTER 1: INTRODUCTION & PROJECT OVERVIEW", True, False, 16, BLACK)],
        align=WD_ALIGN_PARAGRAPH.CENTER,
    )
    remove_paragraph(blank79_p)
    remove_paragraph(topic1_p)

    def add_subtopic(title):
        return insert_p_before(chap_anchor, title, style="Heading 3", bold=True, size_pt=14, space_before=10, space_after=4)

    def add_body(text):
        return insert_p_before(chap_anchor, text, style="Body Text", align=WD_ALIGN_PARAGRAPH.JUSTIFY, size_pt=12, space_after=6)

    def add_bullet(lead, text):
        p = insert_p_before(chap_anchor, "", style="List Paragraph", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=3)
        add_styled_run(p, f"• {lead}: ", bold=True, size_pt=12)
        add_styled_run(p, text, bold=False, size_pt=12)
        return p

    def add_chapter_title(title):
        return insert_p_before(chap_anchor, title, style="Normal", align=WD_ALIGN_PARAGRAPH.CENTER, bold=True, size_pt=16, space_before=6, space_after=10, page_break_before=True)

    # --- CHAPTER 1 CONTENT ---
    add_subtopic("1.1 Problem Statement & Background")
    add_body(
        "In enterprise cloud engineering, system outages and degraded performance are inevitable due to dependency drift, memory exhaustion, network partitions, and misconfigured security policies. While computer engineering curricula teach foundational cloud concepts, students rarely gain hands-on experience diagnosing and recovering live distributed systems under production constraints. DeployFix Lab bridges this gap by providing an interactive, containerized cloud sandbox where realistic incidents can be injected, observed via real-time telemetry, and resolved using standard Site Reliability Engineering (SRE) workflows."
    )

    add_subtopic("1.2 Motivation & Industry Relevance of SRE")
    add_body(
        "Site Reliability Engineering emphasizes measurable Service Level Objectives (SLOs), automated infrastructure provisioning, and rapid Mean Time to Recovery (MTTR). Deploying DeployFix Lab on Amazon Web Services (AWS) demonstrates practical mastery of cloud networking, Linux system administration, Docker multi-container orchestration, reverse proxying, and production debugging—all within strict Free Tier resource budgets (1 GB RAM, 30 GB EBS)."
    )

    add_subtopic("1.3 Objectives & Scope of DeployFix Lab")
    add_bullet("Zero-Cost AWS Deployment", "Deploy a full-stack microservices platform on AWS EC2 strictly within the 12-Month Free Tier.")
    add_bullet("Custom Domain & TLS Ingress", "Route public traffic through GoDaddy subdomain deployfixlab.devlinktech.online with NGINX SSL termination.")
    add_bullet("Role-Based Access Control (RBAC)", "Support distinct Platform Admin, Lead Instructor, and Student Engineer workflows secured via JWT and HTTP cookies.")
    add_bullet("Authentic Incident Postmortems", "Document and resolve real production deployment failures across Alpine Linux, Docker DNS, and CORS policies.")

    # --- CHAPTER 2 CONTENT ---
    add_chapter_title("CHAPTER 2: CLOUD ARCHITECTURE & SYSTEM DESIGN")

    add_subtopic("2.1 Three-Tier Microservices Topology")
    add_body(
        "DeployFix Lab implements a defense-in-depth, three-tier containerized architecture isolated inside a dedicated Docker bridge network (deployfix-network). External client requests arrive at the NGINX edge container, which serves the compiled React Single Page Application (SPA) and reverse-proxies /api/ and WebSocket /ws/ requests to the Node.js backend. The backend communicates over internal Docker DNS with PostgreSQL 16 for persistent relational state and Redis 7 for ephemeral chaos state and caching."
    )

    add_subtopic("2.2 Component Specifications & Containerization")
    add_bullet("Edge & Frontend Tier (deployfix-frontend)", "NGINX Alpine container serving static Vite/React 18 assets, applying gzip compression, and proxying API/WebSocket traffic.")
    add_bullet("Application Tier (deployfix-backend)", "Node.js 20 TypeScript Express server running under unprivileged user node:node on port 5000, managing JWT authentication, RBAC, and chaos injection.")
    add_bullet("Database Tier (deployfix-postgres)", "PostgreSQL 16 Alpine backed by persistent Docker volume pgdata, managed via Prisma ORM migrations and automated seed scripts.")
    add_bullet("Cache Tier (deployfix-redis)", "Redis 7 Alpine providing low-latency state storage for active incident simulations and rate limiting.")

    add_subtopic("2.3 AWS Cloud Infrastructure & Free Tier Compliance")
    add_body(
        "Every AWS resource provisioned for this project adheres to the AWS 12-Month Free Tier in the Asia Pacific (Sydney) region (ap-southeast-2), ensuring a $0.00/month operational cost:"
    )
    insert_table_before(
        doc,
        chap_anchor,
        ["AWS Service", "Configuration Details", "Free Tier Compliance"],
        [
            ["Amazon EC2", "t2.micro / t3.micro, Ubuntu 24.04 LTS in ap-southeast-2", "750 hrs/month free (24/7 coverage)"],
            ["Amazon EBS", "30 GB GP3 General Purpose SSD root volume", "Up to 30 GB/month free storage"],
            ["AWS VPC & IPv4", "Default VPC, Public Subnet, Internet Gateway, IP 16.179.57.228", "750 hrs/month free public IPv4"],
            ["Security Groups", "Stateful firewall permitting Ports 22 (SSH), 80 (HTTP), 443 (HTTPS)", "Included native AWS security"],
            ["Cloud-Init & IaC", "Automated bootstrap script & CloudFormation YAML template", "No additional orchestration cost"],
        ],
    )

    # --- CHAPTER 3 CONTENT ---
    add_chapter_title("CHAPTER 3: PRODUCTION DEPLOYMENT & NETWORKING")

    add_subtopic("3.1 Amazon EC2 Provisioning, Swap & Firewall Hardening")
    add_body(
        "Because Free Tier t2.micro instances provide only 1 GB of physical RAM, compiling TypeScript and bundling frontend assets inside Docker can trigger Out-Of-Memory (OOM) kernel kills. To prevent this, the EC2 bootstrap provisions a 4 GB Linux swapfile (/swapfile) with vm.swappiness=20. Host-level security enforces defense-in-depth by pairing AWS Security Groups with Ubuntu's Uncomplicated Firewall (UFW), allowing only SSH (22), HTTP (80), and HTTPS (443)."
    )

    add_subtopic("3.2 Custom GoDaddy Subdomain & DNS Routing")
    add_body(
        "To provide an accessible, professional production endpoint without disturbing existing websites hosted on the root domain devlinktech.online, a dedicated subdomain was configured in the GoDaddy DNS Management console:"
    )
    add_bullet("DNS Record Type", "A (Address) Record")
    add_bullet("Host / Subdomain", "deployfixlab (resolving to deployfixlab.devlinktech.online)")
    add_bullet("Points To (Value)", "16.179.57.228 (AWS EC2 Public IPv4 in ap-southeast-2)")
    add_bullet("TTL", "600 seconds (10 minutes) for rapid propagation and failover")

    add_subtopic("3.3 NGINX Reverse Proxy & TLS/SSL Configuration")
    add_body(
        "NGINX acts as the single public ingress point on ports 80 and 443. It performs TLS 1.2/1.3 termination using Let's Encrypt certificates managed via Certbot, enforces HTTP-to-HTTPS redirection, forwards X-Forwarded-Proto and X-Real-IP headers to the Node.js backend, and upgrades WebSocket connections for live log streaming."
    )

    # --- CHAPTER 4 CONTENT ---
    add_chapter_title("CHAPTER 4: SRE INCIDENT SIMULATION & CASE STUDIES")
    add_body(
        "During the live AWS deployment of DeployFix Lab, four authentic production incidents were encountered, diagnosed from container logs, and permanently resolved in the codebase:"
    )

    add_subtopic("4.1 Incident 1: Dependency Packaging Failure (Cannot find module 'zod')")
    add_bullet("Symptom", "deployfix-backend entered a Restarting (1) crash loop; NGINX returned 502 Bad Gateway.")
    add_bullet("Root Cause", "Schema validation library zod was listed under devDependencies in package.json, causing npm ci --omit=dev inside the production Dockerfile to exclude it.")
    add_bullet("Resolution", "Moved zod to runtime dependencies in Application/backend/package.json and regenerated package-lock.json.")

    add_subtopic("4.2 Incident 2: Alpine OpenSSL Binary Incompatibility (libssl.so.1.1)")
    add_bullet("Symptom", "Prisma Client threw PrismaClientInitializationError due to missing libssl.so.1.1 on Alpine Linux.")
    add_bullet("Root Cause", "Modern Alpine images ship OpenSSL 3.0, whereas Prisma defaulted to OpenSSL 1.1 when the openssl CLI binary was absent during image build.")
    add_bullet("Resolution", "Installed openssl and libc6-compat in the Dockerfile and explicitly configured binaryTargets = [\"native\", \"linux-musl-openssl-3.0.x\"] in schema.prisma.")

    add_subtopic("4.3 Incident 3: Docker Bridge DNS Loopback (localhost vs postgres)")
    add_bullet("Symptom", "Database migrations failed with error P1001: Can't reach database server at localhost:5432.")
    add_bullet("Root Cause", "Inside a Docker container, localhost resolves to the container's own loopback interface rather than the PostgreSQL container.")
    add_bullet("Resolution", "Updated docker-compose.yml and .env to target the Docker Compose service hostname postgres:5432.")

    add_subtopic("4.4 Incident 4: CORS Rejection & Secure Cookie Logout Loop")
    add_bullet("Symptom", "Users authenticated successfully, loaded the dashboard briefly, and were immediately redirected back to /login.")
    add_bullet("Root Cause", "Backend CORS only whitelisted localhost (rejecting 16.179.57.228 and custom domain origins), while auth cookies hardcoded secure: true, causing browsers to drop cookies over plain HTTP.")
    add_bullet("Resolution", "Implemented dynamic request origin reflection in app.ts and request-aware secure: isRequestSecure(req) cookie flags in auth.controller.ts.")

    # --- CHAPTER 5 CONTENT ---
    add_chapter_title("CHAPTER 5: VERIFICATION, TESTING & LIVE DEMONSTRATION")

    add_subtopic("5.1 Live Endpoints & Evaluation Credentials (RBAC)")
    add_body(
        "The live application is publicly accessible at https://deployfixlab.devlinktech.online (with direct EC2 fallback at http://16.179.57.228) and source-controlled at https://github.com/Radheshbhuva/DeployFixLab. Evaluators can verify Role-Based Access Control using the following seeded accounts:"
    )
    insert_table_before(
        doc,
        chap_anchor,
        ["Role", "Email Address", "Password", "System Privileges"],
        [
            ["Platform Admin", "admin@deployfix.lab", "Password123!", "Chaos Control, Failure Injection, Full SRE Privileges"],
            ["Lead Instructor", "instructor@deployfix.lab", "Password123!", "Scenario Authoring, Student Progress Monitoring"],
            ["Student Engineer", "student@deployfix.lab", "Password123!", "Guided Incident Recovery Labs & Live Telemetry"],
        ],
    )

    add_subtopic("5.2 Health Checks & Functional Verification")
    add_bullet("Container Health", "All four Docker services (frontend, backend, postgres, redis) verified healthy via docker compose ps.")
    add_bullet("API & Database Integrity", "Prisma schema migrations and seed scripts executed cleanly; /api/health returns HTTP 200 OK.")
    add_bullet("End-to-End Authentication", "Verified persistent login, JWT cookie issuance, and RBAC dashboard routing across both HTTPS custom domain and HTTP IP endpoints.")

    # --- CHAPTER 6 CONTENT ---
    add_chapter_title("CHAPTER 6: CONCLUSION & FUTURE ENHANCEMENTS")

    add_subtopic("6.1 Summary & Key Learnings")
    add_body(
        "DeployFix Lab successfully demonstrates end-to-end cloud engineering, container orchestration, and Site Reliability Engineering on Amazon Web Services within a zero-cost Free Tier budget. By confronting and resolving real-world failures in memory allocation (4 GB swap), Alpine OpenSSL linkage, Docker bridge DNS, and CORS/cookie security, the project bridges theoretical Cloud Computing Essentials (01CE0514) concepts with production operational rigor."
    )

    add_subtopic("6.2 Future Roadmap")
    # Put the final paragraph into chap_anchor itself so chap_anchor's sectPr cleanly transitions to References!
    set_paragraph_segments(
        chap_anchor,
        [
            (
                "Future iterations of DeployFix Lab can expand into multi-node Kubernetes (Amazon EKS) orchestration for automated horizontal pod autoscaling, integrate Prometheus and Grafana dashboards for real-time golden-signal observability (latency, traffic, errors, saturation), and incorporate automated CI/CD GitHub Actions pipelines for zero-downtime blue-green deployments.",
                False,
                False,
                12,
                BLACK,
            )
        ],
        align=WD_ALIGN_PARAGRAPH.JUSTIFY,
    )

    # ---------------------------------------------------------
    # 9. REFERENCES (Section 8: P82 - P87 in original)
    # ---------------------------------------------------------
    # Locate References heading dynamically
    ref_idx = None
    for idx, p in enumerate(doc.paragraphs):
        if p.text.strip() == "References":
            ref_idx = idx
            break

    if ref_idx is not None:
        refs = [
            "Amazon Web Services, Inc. (2026). “Amazon EC2 User Guide for Linux Instances & AWS Free Tier Documentation.” AWS Documentation.",
            "Beyer, B., Jones, C., Petoff, J., & Murphy, N. R. (2016). “Site Reliability Engineering: How Google Runs Production Systems.” O'Reilly Media.",
            "Docker, Inc. (2026). “Docker Compose Networking & Multi-Stage Build Reference.” Docker Official Documentation.",
            "F5, Inc. (2026). “NGINX Reverse Proxy, SSL Termination, and WebSocket Proxying Guide.” NGINX Documentation.",
            "Prisma Data, Inc. (2026). “Prisma ORM: Binary Targets, Alpine Linux (musl) & PostgreSQL Deployment.” Prisma Documentation.",
        ]
        # Update the 2 existing reference List Paragraphs
        set_paragraph_segments(doc.paragraphs[ref_idx + 1], [(refs[0], False, False, 12, BLACK)], align=WD_ALIGN_PARAGRAPH.JUSTIFY)
        set_paragraph_segments(doc.paragraphs[ref_idx + 2], [(refs[1], False, False, 12, BLACK)], align=WD_ALIGN_PARAGRAPH.JUSTIFY)

        # Remove the red NOTE paragraph if present
        for p in list(doc.paragraphs[ref_idx + 3 :]):
            if "NOTE:" in p.text or not p.text.strip():
                remove_paragraph(p)

        # Append remaining references
        for r_text in refs[2:]:
            p = doc.add_paragraph("", style="List Paragraph")
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            add_styled_run(p, r_text, bold=False, size_pt=12)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    doc.save(OUTPUT_PATH)
    shutil.copy2(OUTPUT_PATH, ARTIFACT_PATH)
    print("Generated:", OUTPUT_PATH)
    print("Artifact copy:", ARTIFACT_PATH)


if __name__ == "__main__":
    main()
