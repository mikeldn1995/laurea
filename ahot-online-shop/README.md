# AHOT competence web report

AHOT supporting report for TO00CD61-3002. Published from the Laurea repository through its existing GitHub Pages configuration.

Live report: https://mikeldn1995.github.io/laurea/ahot-online-shop/

From this directory, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. The page is buildless and uses relative asset links for GitHub Pages compatibility. The report follows the five course requirements using standard fonts, a single reading column and 22 numbered screenshots placed beside the relevant explanations. It includes the Alexander Lajer project and authenticated aggregate Cloudflare/Resend evidence. Click a screenshot to inspect the original capture. Use Review notes for section-specific notes, saved in this browser; export the notes before changing browser or URL. Notes are not synced or included in Git. Edit the source to apply approved wording.

Deliverables: `index.html` web report, `tutor-email.txt` draft addressed to the lecturer, `report.html` print-friendly report, and `output/pdf/ahot-report.pdf` one-page attachment. `EVIDENCE.md` explains verified sources and remaining gaps. `DESIGN.md` records design provenance.

The matching report HTML and PDF can be regenerated with `scripts/build_report.py` using Python with ReportLab and pypdf. Edit its content constants to keep the two formats aligned.

Before sending, confirm dates and individual contribution, review remaining claims, and attach any relevant transcripts that actually exist. The page is supporting evidence; it does not replace the requested one-page report.

GitHub Pages serves the repository root from `main`; the report is in `ahot-online-shop/`. Changes are scoped to this directory, preserving other coursework. Do not include `internal/` or exported review notes. Do not publish private source code, personal analytics or client records.
