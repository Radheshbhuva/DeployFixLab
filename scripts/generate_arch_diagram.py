import os
from PIL import Image, ImageDraw, ImageFont

OUT_PATH = r"c:\House_of_Growth\DeployFix_Lab-Trial\scripts\fig_12_1_aws_arch.png"


def get_font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_rounded_box(draw, xy, fill, outline, radius=16, width=3):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=width)


def draw_centered_lines(draw, box, lines, fonts, colors, line_spacing=8):
    x1, y1, x2, y2 = box
    total_h = 0
    heights = []
    for text, f in zip(lines, fonts):
        bbox = draw.textbbox((0, 0), text, font=f)
        h = bbox[3] - bbox[1]
        heights.append(h)
        total_h += h
    total_h += line_spacing * (len(lines) - 1)
    curr_y = y1 + (y2 - y1 - total_h) // 2
    for text, f, c, h in zip(lines, fonts, colors, heights):
        bbox = draw.textbbox((0, 0), text, font=f)
        w = bbox[2] - bbox[0]
        curr_x = x1 + (x2 - x1 - w) // 2
        draw.text((curr_x, curr_y), text, font=f, fill=c)
        curr_y += h + line_spacing


def draw_arrow(draw, start, end, color="#334155", width=3, head_len=14):
    import math
    x1, y1 = start
    x2, y2 = end
    draw.line([x1, y1, x2, y2], fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2 - head_len * math.cos(angle - math.pi / 6), y2 - head_len * math.sin(angle - math.pi / 6))
    p2 = (x2 - head_len * math.cos(angle + math.pi / 6), y2 - head_len * math.sin(angle + math.pi / 6))
    draw.polygon([(x2, y2), p1, p2], fill=color)


def main():
    W, H = 1800, 980
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)

    f_title = get_font(34, bold=True)
    f_box_title = get_font(26, bold=True)
    f_box_body = get_font(20, bold=False)
    f_label = get_font(18, bold=True)
    f_note = get_font(18, bold=False)

    # Top Title
    title_text = "DEPLOYED AWS CLOUD ARCHITECTURE (ap-southeast-2)"
    tb = draw.textbbox((0, 0), title_text, font=f_title)
    draw.text(((W - (tb[2] - tb[0])) // 2, 24), title_text, font=f_title, fill="#1F4E79")

    # Outer AWS EC2 Container Box
    ec2_box = (520, 110, 1440, 900)
    draw.rounded_rectangle(ec2_box, radius=20, fill="#F8FAFC", outline="#64748B", width=3)
    draw.text((550, 128), "Amazon EC2 (t2/t3.micro • Ubuntu 24.04 LTS • 16.179.57.228 • 4GB Swap)", font=f_label, fill="#334155")

    # Box 1: Users
    b_users = (40, 260, 260, 440)
    draw_rounded_box(draw, b_users, "#F1F5F9", "#475569")
    draw_centered_lines(
        draw, b_users,
        ["Users", "Admin / Instructor", "Student Browser"],
        [f_box_title, f_box_body, f_box_body],
        ["#0F172A", "#334155", "#334155"],
    )

    # Box 2: GoDaddy DNS
    b_dns = (300, 260, 480, 440)
    draw_rounded_box(draw, b_dns, "#FEF3C7", "#B45309")
    draw_centered_lines(
        draw, b_dns,
        ["GoDaddy DNS", "deployfixlab.", "devlinktech.online"],
        [f_box_title, f_box_body, f_box_body],
        ["#78350F", "#92400E", "#92400E"],
    )

    # Box 3: NGINX Reverse Proxy + Frontend
    b_nginx = (560, 200, 920, 500)
    draw_rounded_box(draw, b_nginx, "#E0F2FE", "#0369A1")
    draw_centered_lines(
        draw, b_nginx,
        ["NGINX + React 18 SPA", "Ports 80 / 443 (HTTPS)", "Certbot TLS Termination", "Static Bundle + /api Proxy", "WebSocket Upgrade (/ws)"],
        [f_box_title, f_box_body, f_box_body, f_box_body, f_box_body],
        ["#0C4A6E", "#0369A1", "#334155", "#334155", "#334155"],
    )

    # Box 4: Node.js Backend
    b_api = (560, 580, 920, 840)
    draw_rounded_box(draw, b_api, "#DCFCE7", "#15803D")
    draw_centered_lines(
        draw, b_api,
        ["Node.js 20 Backend", "Express + TypeScript (Port 5000)", "JWT Auth • RBAC • Chaos Engine", "Dynamic CORS & Cookie Security"],
        [f_box_title, f_box_body, f_box_body, f_box_body],
        ["#14532D", "#166534", "#334155", "#334155"],
    )

    # Box 5: PostgreSQL 16
    b_db = (1030, 200, 1400, 470)
    draw_rounded_box(draw, b_db, "#DCFCE7", "#15803D")
    draw_centered_lines(
        draw, b_db,
        ["PostgreSQL 16 Alpine", "Users • LabScenarios", "ChaosFailures • Tasks", "AuditLogs • Diagnostics", "(Persistent EBS Volume)"],
        [f_box_title, f_box_body, f_box_body, f_box_body, f_box_body],
        ["#14532D", "#334155", "#334155", "#334155", "#166534"],
    )

    # Box 6: Redis 7
    b_redis = (1030, 580, 1400, 840)
    draw_rounded_box(draw, b_redis, "#FEF3C7", "#B45309")
    draw_centered_lines(
        draw, b_redis,
        ["Redis 7 Alpine", "Active Chaos State", "Session & Rate Cache", "Docker DNS: redis:6379"],
        [f_box_title, f_box_body, f_box_body, f_box_body],
        ["#78350F", "#334155", "#334155", "#92400E"],
    )

    # Box 7: AWS Security & Operations (Right outside EC2)
    b_ops = (1490, 260, 1760, 560)
    draw_rounded_box(draw, b_ops, "#EDE9FE", "#6D28D9")
    draw_centered_lines(
        draw, b_ops,
        ["AWS Security & Ops", "Security Group (22, 80, 443)", "Ubuntu UFW Firewall", "Cloud-Init & CloudFormation", "GitHub Repo Sync"],
        [f_box_title, f_box_body, f_box_body, f_box_body, f_box_body],
        ["#4C1D95", "#334155", "#334155", "#334155", "#334155"],
    )

    # Arrows
    draw_arrow(draw, (260, 350), (300, 350))
    draw.text((262, 320), "HTTPS", font=f_label, fill="#334155")

    draw_arrow(draw, (480, 350), (560, 350))
    draw.text((488, 320), "A-Rec", font=f_label, fill="#334155")

    draw_arrow(draw, (740, 500), (740, 580))
    draw.text((752, 528), "/api & /ws", font=f_label, fill="#334155")

    draw_arrow(draw, (920, 650), (1030, 360))
    draw.text((925, 470), "Prisma", font=f_label, fill="#334155")

    draw_arrow(draw, (920, 710), (1030, 710))
    draw.text((935, 680), "TCP 6379", font=f_label, fill="#334155")

    draw_arrow(draw, (1440, 410), (1490, 410))

    # Footer Note
    note = "*All 4 containers run inside isolated Docker bridge network (deployfix-network) within AWS 12-Month Free Tier ($0.00/mo)."
    nb = draw.textbbox((0, 0), note, font=f_note)
    draw.text(((W - (nb[2] - nb[0])) // 2, 928), note, font=f_note, fill="#475569")

    img.save(OUT_PATH, dpi=(300, 300))
    print("Saved architecture diagram:", OUT_PATH)


if __name__ == "__main__":
    main()
