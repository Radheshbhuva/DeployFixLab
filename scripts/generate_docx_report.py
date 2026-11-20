import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Set Margins (1 inch all sides)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("DeployFix Lab — AWS Cloud Deployment Project Report")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(100, 116, 139)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("DeployFix Lab | Academic Capstone & Cloud Engineering Laboratory Report | Page ")
        frun.font.name = "Calibri"
        frun.font.size = Pt(9)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # Styles
    navy = RGBColor(30, 58, 138)       # #1E3A8A
    cyan = RGBColor(2, 132, 199)       # #0284C7
    slate = RGBColor(51, 65, 85)       # #334155
    charcoal = RGBColor(15, 23, 42)    # #0F172A

    # =========================================================================
    # COVER / TITLE PAGE
    # =========================================================================
    p_title_space = doc.add_paragraph()
    p_title_space.paragraph_format.space_before = Pt(36)

    p_badge = doc.add_paragraph()
    p_badge.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_badge = p_badge.add_run("UNIVERSITY CAPSTONE & CLOUD COMPUTING LABORATORY")
    r_badge.font.name = "Calibri"
    r_badge.font.size = Pt(11)
    r_badge.font.bold = True
    r_badge.font.color.rgb = cyan

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(6)
    r_title = p_title.add_run("DeployFix Lab")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(32)
    r_title.font.bold = True
    r_title.font.color.rgb = navy

    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_after = Pt(24)
    r_sub = p_subtitle.add_run("Automated Production Deployment, Chaos Engineering Sandbox &\nCloud Incident Recovery on Amazon Web Services (AWS)")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(14)
    r_sub.font.color.rgb = slate

    # Divider bar
    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_after = Pt(28)
    r_div = p_div.add_run("━" * 45)
    r_div.font.color.rgb = cyan

    # Metadata Box (Table)
    meta_table = doc.add_table(rows=7, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Candidate Name / Student ID:", "Radhesh Bhuva (Lead Student Engineer)"),
        ("Course / Department:", "B.Tech / B.E. Computer Science & Engineering (Cloud Computing)"),
        ("Live Platform URL:", "https://deployfixlab.devlinktech.online"),
        ("Live Server Endpoint:", "http://16.179.57.228 (Ports 80, 443)"),
        ("AWS Hosting Region:", "ap-southeast-2 (Asia Pacific - Sydney)"),
        ("Source Code Repository:", "https://github.com/Radheshbhuva/DeployFixLab.git"),
        ("Cloud Cost Model:", "AWS 12-Month Free Tier Compliant ($0.00 / month)"),
    ]

    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.5)
        c1.width = Inches(4.0)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=80, bottom=80, left=100, right=100)
        set_cell_margins(c1, top=80, bottom=80, left=100, right=100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(label)
        r0.font.name = "Calibri"
        r0.font.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = navy

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(val)
        r1.font.name = "Calibri"
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = charcoal

    p_cover_foot = doc.add_paragraph()
    p_cover_foot.paragraph_format.space_before = Pt(40)
    p_cover_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cfoot = p_cover_foot.add_run("ACADEMIC YEAR 2026-2027 • FINAL LABORATORY PROJECT EVALUATION")
    r_cfoot.font.name = "Calibri"
    r_cfoot.font.size = Pt(9)
    r_cfoot.font.color.rgb = RGBColor(148, 163, 184)

    doc.add_page_break()

    # =========================================================================
    # SECTION 1: EXECUTIVE SUMMARY
    # =========================================================================
    h1 = doc.add_heading("1. Executive Summary & Project Overview", level=1)
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(8)
    h1.runs[0].font.name = "Calibri"
    h1.runs[0].font.color.rgb = navy

    p1 = doc.add_paragraph()
    p1.paragraph_format.line_spacing = 1.15
    p1.paragraph_format.space_after = Pt(8)
    p1.add_run(
        "DeployFix Lab is an advanced, production-grade cloud troubleshooting and guided chaos recovery platform designed to train software and Site Reliability Engineers (SREs). "
        "The objective of this university project is to demonstrate end-to-end cloud engineering: architecting, provisioning, automating, securing, and deploying a multi-tier microservice application onto Amazon Web Services (AWS) strictly within the 12-Month Free Tier allocation ($0.00/month footprint)."
    )

    p2 = doc.add_paragraph()
    p2.paragraph_format.line_spacing = 1.15
    p2.paragraph_format.space_after = Pt(8)
    p2.add_run(
        "The production deployment features a fully containerized architecture orchestrated via Docker Compose, fronted by an NGINX reverse proxy with automated Let's Encrypt TLS 1.3 encryption, connected to a custom registered domain (deployfixlab.devlinktech.online) managed via GoDaddy DNS, and hardened using Linux UFW host firewalls and AWS Security Groups."
    )

    # Key Objectives Callout Box
    table_obj = doc.add_table(rows=1, cols=1)
    table_obj.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_obj = table_obj.rows[0].cells[0]
    cell_obj.width = Inches(6.5)
    set_cell_background(cell_obj, "F0F9FF")
    set_cell_margins(cell_obj, top=120, bottom=120, left=160, right=160)
    p_box = cell_obj.paragraphs[0]
    p_box.paragraph_format.space_after = Pt(4)
    r_btitle = p_box.add_run("Key Project Engineering Achievements:")
    r_btitle.font.name = "Calibri"
    r_btitle.font.bold = True
    r_btitle.font.color.rgb = cyan

    bullets = [
        "100% AWS Free Tier Compliance: Hosted on t2/t3.micro with 4GB Linux swap space to guarantee zero OOM compiler failures on 1GB RAM instances.",
        "Custom Domain & Automated SSL: Configured deployfixlab.devlinktech.online with HTTP-01 Let's Encrypt automated certificate lifecycle.",
        "Production Container Orchestration: Unified multi-container Docker Compose running NGINX, Node.js Express, PostgreSQL 16, and Redis 7.",
        "Infrastructure as Code (IaC): Full AWS CloudFormation template and Cloud-Init user-data automated bootstrap script.",
        "Authentic SRE Troubleshooting: Documented and resolved four real-world production incidents (missing zod runtime module, Alpine OpenSSL engine compatibility, container DNS loopback, and CORS reflection).",
        "Automated Verification Suite: Built scripts/verify-deployment.js running 19 automated pre-flight checks across IaC, API, DB, and SPA bundles."
    ]
    for b in bullets:
        pb = cell_obj.add_paragraph(style='List Bullet')
        pb.paragraph_format.space_after = Pt(3)
        rb = pb.add_run(b)
        rb.font.name = "Calibri"
        rb.font.size = Pt(9.5)
        rb.font.color.rgb = charcoal

    # =========================================================================
    # SECTION 2: LIVE EVALUATION CREDENTIALS
    # =========================================================================
    h2 = doc.add_heading("2. Live Application Access & Role-Based Evaluation Credentials", level=1)
    h2.paragraph_format.space_before = Pt(16)
    h2.paragraph_format.space_after = Pt(8)
    h2.runs[0].font.name = "Calibri"
    h2.runs[0].font.color.rgb = navy

    p_cred_intro = doc.add_paragraph()
    p_cred_intro.paragraph_format.line_spacing = 1.15
    p_cred_intro.paragraph_format.space_after = Pt(8)
    p_cred_intro.add_run(
        "Evaluators can access the live production instance at https://deployfixlab.devlinktech.online (or http://16.179.57.228) and test role-based access control (RBAC) across three distinct engineering personas:"
    )

    cred_table = doc.add_table(rows=4, cols=4)
    cred_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Role / Persona", "Email Address", "Password", "Permissions & Capabilities"]
    for j, h in enumerate(headers):
        c = cred_table.rows[0].cells[j]
        set_cell_background(c, "1E3A8A")
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    cred_data = [
        ("Platform Admin", "admin@deployfix.lab", "Password123!", "Access to Chaos CLI Sandbox, synthetic fault injection, active student session oversight, and full telemetry inspection."),
        ("Lead Instructor", "instructor@deployfix.lab", "Password123!", "Scenario authoring, student progress monitoring, lab template creation, and evaluation reviews."),
        ("Student Engineer", "student@deployfix.lab", "Password123!", "Hands-on guided incident recovery labs, terminal debugging, live log analysis, and root cause verification.")
    ]

    for i, row in enumerate(cred_data):
        for j, val in enumerate(row):
            c = cred_table.rows[i+1].cells[j]
            bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if j == 0:
                r.font.bold = True
                r.font.color.rgb = navy
            elif j == 2:
                r.font.name = "Consolas"
                r.font.color.rgb = RGBColor(185, 28, 28)

    # =========================================================================
    # SECTION 3: SYSTEM ARCHITECTURE
    # =========================================================================
    h3 = doc.add_heading("3. Multi-Tier Microservice Architecture", level=1)
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(8)
    h3.runs[0].font.name = "Calibri"
    h3.runs[0].font.color.rgb = navy

    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.line_spacing = 1.15
    p_arch.paragraph_format.space_after = Pt(8)
    p_arch.add_run(
        "DeployFix Lab utilizes a containerized, defense-in-depth architecture. The application layers communicate exclusively over an isolated Docker bridge network (deployfix-network), preventing external access to internal database and caching services."
    )

    arch_table = doc.add_table(rows=5, cols=4)
    arch_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    arch_headers = ["Layer / Service", "Technology Stack", "Network Port", "Key Responsibility"]
    for j, h in enumerate(arch_headers):
        c = arch_table.rows[0].cells[j]
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    arch_data = [
        ("Edge Ingress & Reverse Proxy", "NGINX (Alpine Linux) + Certbot", "80 (HTTP), 443 (HTTPS)", "SSL termination, gzip compression, SPA static assets, and WebSocket connection upgrading (/logs/stream)."),
        ("Application Backend", "Node.js 20 LTS, Express, WebSocket, Prisma", "5000 (Internal Bridge)", "Business logic, JWT RBAC security, chaos simulation engine, and live telemetry broadcast."),
        ("Relational Database", "PostgreSQL 16 Alpine + Persistent EBS Volume", "5432 (Internal Bridge)", "ACID-compliant storage for users, incident audit logs, lab templates, and student progress records."),
        ("Cache & Fast State", "Redis 7 Alpine + Persistent Data Volume", "6379 (Internal Bridge)", "In-memory session state, chaos injection locks, and high-frequency telemetry caching.")
    ]

    for i, row in enumerate(arch_data):
        for j, val in enumerate(row):
            c = arch_table.rows[i+1].cells[j]
            bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if j == 0:
                r.font.bold = True
                r.font.color.rgb = navy

    # =========================================================================
    # SECTION 4: AWS CLOUD INFRASTRUCTURE
    # =========================================================================
    h4 = doc.add_heading("4. AWS Cloud Infrastructure & Free Tier Compliance ($0.00/mo)", level=1)
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(8)
    h4.runs[0].font.name = "Calibri"
    h4.runs[0].font.color.rgb = navy

    p_aws = doc.add_paragraph()
    p_aws.paragraph_format.line_spacing = 1.15
    p_aws.paragraph_format.space_after = Pt(8)
    p_aws.add_run(
        "A primary requirement of this cloud deployment was strict adherence to the AWS 12-Month Free Tier to avoid unexpected institutional or personal cloud expenditure. The table below details the exact cloud resource allocation:"
    )

    aws_table = doc.add_table(rows=6, cols=4)
    aws_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    aws_headers = ["AWS Service", "Resource Specification", "Free Tier Allowance", "Monthly Cost"]
    for j, h in enumerate(aws_headers):
        c = aws_table.rows[0].cells[j]
        set_cell_background(c, "1E3A8A")
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    aws_data = [
        ("Amazon Elastic Compute Cloud (EC2)", "t2.micro / t3.micro (1 vCPU, 1 GiB RAM) in ap-southeast-2", "750 hours / month (covers 1 instance 24/7)", "$0.00"),
        ("Amazon Elastic Block Store (EBS)", "30 GiB GP3 SSD Volume (Root OS & Container Storage)", "Up to 30 GiB of General Purpose SSD free", "$0.00"),
        ("Amazon VPC & Public IPv4", "Default VPC, Internet Gateway, 1 Public IPv4 address", "750 hours / month of public IPv4 included free", "$0.00"),
        ("AWS Security Groups", "Stateful packet firewall (Inbound TCP: 22, 80, 443)", "Always Free native security construct", "$0.00"),
        ("AWS CloudFormation", "Declarative YAML template (deployfix-cloudformation.yaml)", "Always Free infrastructure orchestration", "$0.00")
    ]

    for i, row in enumerate(aws_data):
        for j, val in enumerate(row):
            c = aws_table.rows[i+1].cells[j]
            bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            if j == 3:
                r.font.bold = True
                r.font.color.rgb = RGBColor(22, 101, 52) # Dark Green

    # =========================================================================
    # SECTION 5: SRE CASE STUDIES
    # =========================================================================
    h5 = doc.add_heading("5. Real-World SRE Case Studies & Incident Resolutions", level=1)
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(8)
    h5.runs[0].font.name = "Calibri"
    h5.runs[0].font.color.rgb = navy

    p_sre_intro = doc.add_paragraph()
    p_sre_intro.paragraph_format.line_spacing = 1.15
    p_sre_intro.paragraph_format.space_after = Pt(8)
    p_sre_intro.add_run(
        "Unlike academic sandbox deployments that only deploy toy code, DeployFix Lab encountered and systematically diagnosed four real-world production engineering failures. These case studies demonstrate rigorous Site Reliability Engineering practice:"
    )

    incidents = [
        ("Incident 1: Production Container Crash Loop — Missing 'zod' Module",
         "Symptom: The deployfix-backend container entered a continuous 'Restarting (1)' loop, causing NGINX to throw HTTP 502 Bad Gateway.\n"
         "Root Cause: In Application/backend/package.json, 'zod' was placed in devDependencies. In the Dockerfile runner stage, 'npm ci --omit=dev' stripped devDependencies to save space, leaving the auth validation module unable to import zod.\n"
         "Engineering Fix: Moved zod to runtime dependencies, regenerated package-lock.json with 'dev': false, and rebuilt the container."),
        
        ("Incident 2: Dynamic Library Incompatibility — Prisma Engine on Alpine Linux",
         "Symptom: Prisma failed during database initialization with: 'PrismaClientInitializationError: Unable to require libquery_engine-linux-musl.so.node: Error loading shared library libssl.so.1.1: No such file or directory'.\n"
         "Root Cause: Modern Alpine Linux (Alpine 3.20+) utilizes OpenSSL 3.0. However, because the openssl CLI utility was missing from the base container, Prisma defaulted to OpenSSL 1.1 and looked for non-existent libssl.so.1.1.\n"
         "Engineering Fix: Added 'RUN apk add --no-cache openssl libc6-compat' to the Dockerfile and explicitly added 'binaryTargets = [\"native\", \"linux-musl-openssl-3.0.x\"]' to schema.prisma."),

        ("Incident 3: Container Network DNS Resolution — Database Connection Failure",
         "Symptom: Database migration failed with: 'P1001: Can't reach database server at localhost:5432'.\n"
         "Root Cause: In Docker bridge networking, each container possesses its own loopback interface ('localhost'). The backend container looked for Postgres locally on 127.0.0.1 where no database existed.\n"
         "Engineering Fix: Configured docker-compose.yml and .env.example to route DATABASE_URL to the internal Docker network hostname '@postgres:5432', enabling automatic container DNS resolution."),

        ("Incident 4: Instant Logout Redirect Loop on Dashboard Navigation",
         "Symptom: Users logged in with valid seeded credentials, but after 1 second were immediately logged out and redirected to /login with 4-5 failed GET requests.\n"
         "Root Cause: Twofold: (1) Express CORS middleware was configured to only permit localhost, rejecting requests from the EC2 public IP. The frontend auth service caught the network error and fell back to an unverified mock token. (2) The session cookie was set with 'secure: true' in production, causing browsers over plain HTTP to drop the Set-Cookie header.\n"
         "Engineering Fix: Refactored CORS to dynamically reflect request origins with credentials enabled, and updated cookie settings to inspect 'req.secure' dynamically so HTTP connections do not drop cookies.")
    ]

    for title, desc in incidents:
        p_inc = doc.add_paragraph()
        p_inc.paragraph_format.space_before = Pt(8)
        p_inc.paragraph_format.space_after = Pt(2)
        r_ititle = p_inc.add_run(f"• {title}")
        r_ititle.font.name = "Calibri"
        r_ititle.font.bold = True
        r_ititle.font.size = Pt(10.5)
        r_ititle.font.color.rgb = navy

        p_idesc = doc.add_paragraph()
        p_idesc.paragraph_format.left_indent = Inches(0.25)
        p_idesc.paragraph_format.line_spacing = 1.15
        p_idesc.paragraph_format.space_after = Pt(6)
        r_idesc = p_idesc.add_run(desc)
        r_idesc.font.name = "Calibri"
        r_idesc.font.size = Pt(9.5)
        r_idesc.font.color.rgb = charcoal

    # =========================================================================
    # SECTION 6: EVALUATOR VERIFICATION GUIDE
    # =========================================================================
    h6 = doc.add_heading("6. Evaluator Step-by-Step Verification Guide", level=1)
    h6.paragraph_format.space_before = Pt(16)
    h6.paragraph_format.space_after = Pt(8)
    h6.runs[0].font.name = "Calibri"
    h6.runs[0].font.color.rgb = navy

    steps = [
        ("Step 1: Verify Domain & SSL Certificate", "Open https://deployfixlab.devlinktech.online in any modern web browser. Verify the green padlock icon in the address bar. Click the padlock to inspect the Let's Encrypt certificate details."),
        ("Step 2: Authenticate as Platform Administrator", "Click '1-Click Demo Accounts > Platform Admin' (or enter admin@deployfix.lab / Password123!). Click 'Sign In to Workspace' to access the SRE Chaos Control Sandbox."),
        ("Step 3: Test Real-Time Telemetry & Chaos Terminal", "In the Admin Chaos Sandbox, observe the real-time WebSocket connection to /logs/stream. Execute commands in the Chaos Operator Terminal (e.g., 'chaos list' or 'inject latency') to verify WebSocket response fidelity."),
        ("Step 4: Inspect Cloud Infrastructure Automation", "Visit the public GitHub repository at https://github.com/Radheshbhuva/DeployFixLab to review the automated Cloud-Init script (deployment/aws/ec2-user-data.sh) and CloudFormation template (deployment/aws/deployfix-cloudformation.yaml)."),
        ("Step 5: Verify Automated Test Suite", "Observe the automated test suite in scripts/verify-deployment.js which tests 19 discrete deployment gates (Docker, NGINX, Prisma, Vite, CI/CD).")
    ]

    for title, desc in steps:
        p_step = doc.add_paragraph()
        p_step.paragraph_format.space_before = Pt(6)
        p_step.paragraph_format.space_after = Pt(2)
        r_st = p_step.add_run(f"✔ {title}")
        r_st.font.name = "Calibri"
        r_st.font.bold = True
        r_st.font.size = Pt(10)
        r_st.font.color.rgb = RGBColor(22, 101, 52) # Dark green

        p_sd = doc.add_paragraph()
        p_sd.paragraph_format.left_indent = Inches(0.25)
        p_sd.paragraph_format.line_spacing = 1.15
        p_sd.paragraph_format.space_after = Pt(4)
        r_sd = p_sd.add_run(desc)
        r_sd.font.name = "Calibri"
        r_sd.font.size = Pt(9.5)
        r_sd.font.color.rgb = charcoal

    # =========================================================================
    # SECTION 7: CONCLUSION
    # =========================================================================
    h7 = doc.add_heading("7. Conclusion & Academic Reflection", level=1)
    h7.paragraph_format.space_before = Pt(16)
    h7.paragraph_format.space_after = Pt(8)
    h7.runs[0].font.name = "Calibri"
    h7.runs[0].font.color.rgb = navy

    p_conc = doc.add_paragraph()
    p_conc.paragraph_format.line_spacing = 1.15
    p_conc.paragraph_format.space_after = Pt(12)
    p_conc.add_run(
        "The successful deployment of DeployFix Lab on Amazon Web Services validates the principles of Site Reliability Engineering, modern cloud architecture, and cost-optimized infrastructure management. By strictly utilizing the AWS 12-Month Free Tier and enhancing reliability through 4GB swap space, isolated container networking, and automated Let's Encrypt TLS encryption, the platform proves that complex, production-ready systems can be reliably operated at zero institutional cost."
    )

    p_sign = doc.add_paragraph()
    p_sign.paragraph_format.space_before = Pt(24)
    r_sign = p_sign.add_run("Submitted by:\nRadhesh Bhuva\nDepartment of Computer Science & Engineering\nDeployFix Lab Project Team")
    r_sign.font.name = "Calibri"
    r_sign.font.italic = True
    r_sign.font.size = Pt(10)
    r_sign.font.color.rgb = slate

    # Save documents
    repo_out = os.path.abspath(r"c:\House_of_Growth\DeployFix_Lab-Trial\DOCs\14_Deployment\DeployFix_Lab_University_Project_Report.docx")
    artifact_out = os.path.abspath(r"C:\Users\RADHESH\.gemini\antigravity\brain\0e22baf9-17c7-45ce-a8e3-5be80852c54c\DeployFix_Lab_University_Project_Report.docx")

    doc.save(repo_out)
    doc.save(artifact_out)
    print(f"Successfully generated DOCX report at:\n  - {repo_out}\n  - {artifact_out}")

if __name__ == "__main__":
    create_report()
