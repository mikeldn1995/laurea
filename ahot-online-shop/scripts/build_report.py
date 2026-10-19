"""Build the matching one-page AHOT HTML report and PDF. No project secrets used."""
from pathlib import Path
from html import escape
import re

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "output/pdf/ahot-report.pdf"
INTRO = (
    "Alongside my work as a project coordinator at a mental health clinic and my "
    "Laurea studies, I create websites for therapists and wellness professionals as "
    "a hobby and side hustle. My coding knowledge is limited; AI assistance is central "
    "to how these projects were built. Please consider this work as evidence of prior learning."
)
MAPPING = (
    "Together, these projects connect a digital credit shop, audience-focused content, "
    "technical SEO, business-specific conversion analysis and supported customer journeys "
    "to the five AHOT learning outcomes."
)
SECTIONS = [
    (
        "Building an online shop and integrating it with a website",
        "Brandit's public website, https://www.branditlondon.com/, presents branding, visibility "
        "and operations services and links to the client workspace and a free 30-minute call form. "
        "Token bundles are offered inside the practitioner workspace, through Stripe Checkout. "
        "Purchase records, payment verification and webhook fulfilment connect payment to a "
        "usable invoicing balance. The homepage does not advertise token bundles.",
    ),
    (
        "Driving traffic to the online shop",
        "Service, audience and location pages and published articles support organic "
        "discovery and routes to an enquiry. Brandit's public offer links visitors to a call "
        "request and client workspace. Alexander's traffic is analysed below. Alicia's recent "
        "launch means SEO growth cannot yet be assessed.",
    ),
    (
        "Optimizing SEO for the online shop",
        "For Alicia's site, I used AI assistance to add page-specific titles and descriptions, "
        "canonical URLs, sitemap, robots rules and practice, practitioner and location "
        "structured data. Brandit's public site also uses titles, descriptions, canonical "
        "and sharing metadata. These are implemented foundations for search discovery.",
    ),
    (
        "Analyzing relevant conversions for various online businesses",
        "Alexander's Cloudflare Overview reported about 1.67k unique visitors and 21.6k "
        "requests for 19 September-19 October 2026. Its IP-based visitor count can include "
        "bots and is not verified human sessions. Resend showed four delivered emails for "
        "5-19 October: two introductory-call request notifications and two visitor "
        "acknowledgements. That supports two submitted request notifications, not four leads "
        "or confirmed bookings. I cannot calculate a conversion rate from these differing "
        "periods and denominators. For Brandit, a suitable measure is distinct verified paid "
        "sessions divided by distinct created checkout sessions in a dated cohort.",
    ),
    (
        "Supporting the customer's buying process",
        "Brandit recommends sufficient tokens, shows prices and balances, and preserves "
        "prepared invoices during checkout. Verified payment triggers fulfilment. The service "
        "websites help visitors decide to enquire; Alexander's acknowledgement confirms "
        "receipt, while the therapist notification supports follow-up.",
    ),
]
CLOSING = (
    "I kindly ask that this practical experience be considered for recognition. I can "
    "provide a dedicated Brandit demo account and complete a focused supplementary "
    "task if further evidence is needed."
)
body_word_count = len(re.findall(r"\S+", " ".join([INTRO, MAPPING, *[a + " " + b for a, b in SECTIONS], CLOSING])))
assert body_word_count <= 500, body_word_count

def report_markup(text):
    return escape(text).replace(
        "https://www.branditlondon.com/",
        '<a href="https://www.branditlondon.com/">https://www.branditlondon.com/</a>',
    )

html_sections = "\n".join(
    f'<section class="outcome"><div class="number">{i}.</div><div><h2>{escape(title)}</h2><p>{report_markup(text)}</p></div></section>'
    for i, (title, text) in enumerate(SECTIONS, 1)
)
html = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>AHOT report | Michal Kowalczyk</title>
<style>
:root{--ink:#222;--muted:#444;--line:#ccc;--paper:#fff}
*{box-sizing:border-box}body{margin:0;background:#fff;color:var(--ink);font:14px/1.5 Arial,Helvetica,sans-serif}
.toolbar{max-width:210mm;margin:24px auto 12px;display:flex;justify-content:space-between;align-items:center;padding:0 5px;gap:16px}
.toolbar a{color:var(--ink);font-size:13px}.toolbar button{border:1px solid #aaa;border-radius:3px;background:#fff;padding:8px 12px;color:var(--ink);font:13px Arial,Helvetica,sans-serif;cursor:pointer}
.paper{width:210mm;min-height:297mm;margin:0 auto 32px;padding:16mm 17mm 14mm;background:var(--paper)}
h1{font-size:22px;line-height:1.25;font-weight:bold;margin:0 0 9px}
.module{font-size:13px;line-height:1.5;margin:0;color:var(--muted)}.meta{display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding:0 0 12px;margin:14px 0 18px;font-size:11px;color:var(--muted)}
.intro{font-size:14px;line-height:1.5;margin:0 0 17px}.outcome{display:grid;grid-template-columns:18px 1fr;gap:8px;margin:0 0 15px;break-inside:avoid}.number{font-size:14px;font-weight:bold;color:var(--ink)}
h2{font-size:14px;line-height:1.4;margin:0 0 4px;font-weight:bold}.outcome p{font-size:14px;line-height:1.5;margin:0;color:var(--muted)}.outcome a{color:inherit}.scope{font-size:14px;line-height:1.5;margin:20px 0 0;color:var(--muted)}
footer{display:flex;justify-content:space-between;font-size:10px;color:#666;border-top:1px solid var(--line);padding-top:10px;margin-top:22px}
@page{size:A4;margin:0}@media print{body{background:#fff}.toolbar{display:none}.paper{margin:0;box-shadow:none;min-height:297mm;padding:14mm 17mm 12mm}.intro,.outcome p,.scope{font-size:13px;line-height:1.45}.intro{margin-bottom:14px}.outcome{margin-bottom:12px}.scope{margin-top:16px}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
@media screen and (max-width:820px){.paper{width:calc(100% - 24px);min-height:auto;padding:24px 18px}.toolbar{padding:0 18px;margin-top:16px}h1{font-size:22px}.meta{gap:10px;flex-wrap:wrap}}
</style></head><body><nav class="toolbar" aria-label="Report controls"><a href="index.html">&larr; Back to case study</a><button onclick="window.print()">Print / save PDF</button></nav>
<main class="paper"><header><h1>AHOT learning-outcomes report</h1><p class="module">Building Webpages with Online Shop Functionality<br>TO00CD61-3002 / 5 credits</p></header>
<div class="meta"><span><strong>Michal Kowalczyk</strong></span><span>Prepared for Arvind Sharma</span><span>19 October 2026</span></div>
<p class="intro">''' + escape(INTRO) + '</p><p class="intro">' + escape(MAPPING) + '</p>' + html_sections + '<p class="scope">' + escape(CLOSING) + '''</p>
<footer><span>Projects: Brandit / Alicia Ferrero / Alexander Lajer</span><span>One-page learning-outcomes report</span></footer></main></body></html>'''
(ROOT / "report.html").write_text(html, encoding="utf-8")

INK = colors.HexColor("#222222")
MUTED = colors.HexColor("#444444")
LINE = colors.HexColor("#cccccc")
styles = {
    "intro": ParagraphStyle("intro", fontName="Helvetica", fontSize=10.1, leading=14.2, textColor=INK, spaceAfter=10),
    "heading": ParagraphStyle("heading", fontName="Helvetica-Bold", fontSize=10.3, leading=14, textColor=INK, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.1, leading=14.2, textColor=MUTED),
    "num": ParagraphStyle("num", fontName="Helvetica-Bold", fontSize=10.3, leading=14, textColor=INK),
    "closing": ParagraphStyle("closing", fontName="Helvetica", fontSize=10.1, leading=14.2, textColor=MUTED),
}

def page_frame(canvas, doc):
    width, height = A4
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    x = 17 * mm
    canvas.setFont("Helvetica-Bold", 18)
    canvas.setFillColor(INK)
    canvas.drawString(x, height-23*mm, "AHOT learning-outcomes report")
    canvas.setFont("Helvetica", 10.3)
    canvas.setFillColor(MUTED)
    canvas.drawString(x, height-31*mm, "Building Webpages with Online Shop Functionality")
    canvas.drawString(x, height-37*mm, "TO00CD61-3002 / 5 credits")
    canvas.setStrokeColor(LINE)
    canvas.setFont("Helvetica-Bold", 8.8)
    canvas.setFillColor(INK)
    canvas.drawString(x, height-46*mm, "Michal Kowalczyk")
    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(width/2+15*mm, height-46*mm, "Prepared for Arvind Sharma")
    canvas.drawRightString(width-x, height-46*mm, "19 October 2026")
    canvas.line(x, height-50*mm, width-x, height-50*mm)
    canvas.line(x, 18*mm, width-x, 18*mm)
    canvas.setFont("Helvetica", 7.3)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(x, 13.5*mm, "Projects: Brandit / Alicia Ferrero / Alexander Lajer")
    canvas.drawRightString(width-x, 13.5*mm, "AHOT / 01")
    canvas.restoreState()

PDF.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(PDF), pagesize=A4, rightMargin=17*mm, leftMargin=17*mm,
                        topMargin=54*mm, bottomMargin=23*mm,
                        title="AHOT report - Michal Kowalczyk", author="Michal Kowalczyk")
story = [Paragraph(escape(INTRO), styles["intro"]), Paragraph(escape(MAPPING), styles["intro"])]
for i, (heading, text) in enumerate(SECTIONS, 1):
    table = Table([[Paragraph(f"{i}.", styles["num"]), [Paragraph(escape(heading), styles["heading"]), Paragraph(report_markup(text), styles["body"])]]], colWidths=[9*mm, 167*mm])
    table.setStyle(TableStyle([("VALIGN", (0,0),(-1,-1),"TOP"), ("LEFTPADDING",(0,0),(-1,-1),0), ("RIGHTPADDING",(0,0),(-1,-1),0), ("TOPPADDING",(0,0),(-1,-1),0), ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
    story.extend([table, Spacer(1, 8)])
story.extend([Spacer(1, 4), Paragraph(escape(CLOSING), styles["closing"])])
doc.build(story, onFirstPage=page_frame, onLaterPages=page_frame)
reader = PdfReader(PDF)
assert len(reader.pages) == 1, f"Report must be one page; got {len(reader.pages)}"
assert "Michal Kowalczyk" in reader.pages[0].extract_text()
print(f"Created {PDF.name}: {len(reader.pages)} A4 page; report body {body_word_count} words")
