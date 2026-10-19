# AHOT evidence notes

Updated 19 October 2026. This records the basis for the supporting web report, including implementation evidence, live public-page checks, authenticated aggregate analytics and the dedicated assessment simulation. Personal enquiry details are not included.

## Course basis

Authenticated Canvas pages inspected on 18 October 2026:

- [AHOT instructions](https://canvas.laurea.fi/courses/14486/pages/demonstration-of-competences-ahot?module_item_id=868991): email the instructor, one-page report, supporting transcripts where available, five specified outcomes and individual assessment.
- [Course overview](https://canvas.laurea.fi/courses/14486/pages/start-here?module_item_id=868986): 5 credits; teaching focuses on WordPress and WooCommerce.
- [Assessment](https://canvas.laurea.fi/courses/14486/pages/course-assessment-and-evaluation?module_item_id=868990): WordPress Content Manager and Google Analytics certifications are included in the taught course. AHOT exemption from them is not stated.
- Instructor: Arvind Sharma. Only Module 0 appeared in the module listing during inspection; this report follows the published AHOT outcomes, rather than claiming to cover every later assignment rubric.

## Brandit implementation

Repository: `/Users/mikek/Code/brandit-os`, remote https://github.com/mikeldn1995/brandit-os.

| Implementation evidence | Source |
| --- | --- |
| Marketing site and practitioner workspace integration | `components/marketing/LandingConcepts.tsx:24` |
| Bundle purchase snapshots, pending record and Stripe Checkout | `app/actions/token-checkout.ts:12` |
| Paid-status reconciliation and webhook verification | `app/actions/token-checkout.ts:65`, `app/api/stripe/webhook/route.ts:22` |
| Transactional token fulfilment and paid purchase record | `lib/suite/token-fulfilment.ts:27` |
| Purchase status, value, session reference and dates | `prisma/schema.prisma:553` |
| Preserved invoice drafts, review and bundle choices | `components/invoicing/InvoicingApp.tsx:75`, `:356`, `:630` |
| Cheapest sufficient bundle recommendation | `lib/suite/token-purchase.ts:10` |

The purchasing practitioner is buying Brandit invoice tokens. The practitioner subsequently invoicing their own customer is a separate business process. Operational records could support analysis; this report does not claim verified live token sales or a measured checkout conversion rate.

### Consistent assessment simulation

The screenshots were captured from a credentials-free isolated copy of the real application, using the actual application components and a dedicated fixture:

- Operator: Michal Kowalczyk; workspace: AHOT Demonstration.
- One Assessment Client with an `example.test` address.
- October batch: two dated £70 charges, £140 total; synthetic 9-token starting balance.
- One synthetic prior September invoice illustrates history and PDF access.
- Checkout and the final send action are disabled. No live payment or email was initiated. Address and bank fields shown are designated assessment examples.

The original repository was not modified. The offer to create a demonstration account for Arvind is an offer; no live account has been created.

## Alicia Ferrero implementation and recency

Repository: `/Users/mikek/Code/alicia-ferrero/current-site`; remote https://github.com/mikeldn1995/af-08-2026; public https://aliciaferrero.com/.

| Implementation evidence | Source |
| --- | --- |
| Titles, descriptions, canonicals and sharing metadata | `lib/seo.ts:43` |
| Practice, person and location structured data | `app/(site)/layout.tsx:56` |
| Indexing files | `app/sitemap.ts:6`, `app/robots.ts:4` |
| Article structured data | `app/(site)/reflections/[slug]/page.tsx:34` |
| Vercel analytics integration | `app/layout.tsx:32` |
| Service information, fees and enquiry form | `app/(site)/page.tsx:23`, `app/(site)/contact/page.tsx:32`, `components/enquiry-form.tsx:15` |

Git contains launch-related commits on 11 October 2026. This supports the recent-launch context; it does not independently establish the deployment timestamp. The applicant reports that meaningful SEO performance data is not available yet. Live public-page checks on 19 October confirmed the article title `Holding the frame | Alicia Ferrero`, its canonical URL and `ProfessionalService` / `BlogPosting` JSON-LD. Local unpublished article flags should not be used as a count of currently live articles; the live page was inspected separately.

Alicia is a service website. Its SEO implementation demonstrates transferable methods rather than verified shop SEO results or ranking improvement.

## Alexander Lajer implementation

Repository: `/Users/mikek/Code/alexander-lajer-therapy`; remote https://github.com/mikeldn1995/ALT3.git. Public pages were inspected at https://www.alexanderlajertherapy.com/ on 19 October 2026.

| Implementation evidence | Source |
| --- | --- |
| Metadata and conditional Cloudflare beacon | `app/layout.jsx:15`, `:59` |
| Contact and provisional call-request handling | `app/api/contact/route.js:33` |
| Therapist notification followed by visitor acknowledgement | `app/api/contact/route.js:44-51`, `:69-78` |
| Provider acceptance/error handling | `lib/email/send.js:24` |
| Actual notification and acknowledgement templates used in simulation | `lib/email/templates.js`, `alexMessageEmail` and `userMessageEmail` |

A normal submission creates two transactional emails. The notification must be accepted for the contact API to return success, but an acknowledgement failure does not change that result. Development skip behaviour and honeypot handling mean UI success alone is not proof of a delivered production enquiry. The call slot is provisional until the practitioner confirms it. No appointment or paying-client outcome is inferred from email delivery.

The public forms were inspected without submitting a message or booking. The browser-check success indicator visible in a form screenshot refers to Turnstile, not to a completed enquiry. The email screenshots were rendered from the actual pure template functions using the same assessment user, without invoking the send module or Resend. They illustrate the implementation and do not reproduce private live messages.

## Authenticated aggregate evidence, 19 October 2026

### Cloudflare

- Domain: `alexanderlajertherapy.com`.
- View: Overview, 30 Days.
- Displayed period: **19 September–19 October 2026**.
- Displayed values: **1.67k Unique Visitors**, **21.6k Total Requests** (rounded by the dashboard).
- Screenshot: `assets/alexander-cloudflare-30days.jpg`.

The screenshot shows the domain, period and charts with the account sidebar collapsed, so account details and IDs are not displayed. The [official Cloudflare explanation](https://developers.cloudflare.com/analytics/faq/about-analytics/) states that visitor counts are based on unique IP requests and can include bots and partial-content consumption. Overview and detailed analytics can also differ because Overview includes subrequests. These are network-traffic indicators, not a verified human-session denominator.

### Resend

- Domain filter: `alexanderlajertherapy.com`.
- Metrics view: Last 15 days, **5–19 October 2026**.
- **4 emails**, **100% delivered** in this small selected sample.
- The corresponding ALTv3-filtered email rows show **2 introductory-call notifications** and **2 visitor acknowledgements**, all delivered.
- Correct interpretation: **2 delivered request notifications**, not 4 leads, confirmed appointments or paying clients.
- Screenshot: `assets/alexander-resend-metrics.jpg`, showing aggregate metrics and filters; no enquirer identities or message content are shown.

The analytics summary is also recorded in `assets/analytics-summary.json`. No enquiry rate is calculated: the periods and populations do not match. A valid rate needs comparable human sessions, deduplicated requests, test exclusions and a consistent observation window. Four delivered messages do not establish long-term delivery performance.

## Screenshot provenance

All 22 in-page figures are described in `assets/analytics-summary.json`. Brandit captures are a named, consistent assessment simulation; Alexander website and analytics captures are from 19 October; Alicia homepage/contact captures are from 18 October and article/service captures from 19 October. Original pixels are preserved; no AI-generated project screens are used.

## Applicant checks before submission

Confirm individual contribution and dates, replace the email's student-number placeholder, and attach relevant transcripts or certificates only if they exist. WordPress/WooCommerce equivalence and any supplementary demonstration remain the instructor's assessment.

## Live Brandit public website, 19 October 2026

The public homepage at https://www.branditlondon.com/ and booking page at https://www.branditlondon.com/book returned HTTP 200 and were reviewed live. The homepage presents branding, visibility and operations services, links to client login and a discovery call, and implements a title, description, canonical and Open Graph metadata. The call form explains the free 30-minute video call, day/time choices, contact fields, confirmation and an email alternative. No live form was submitted. There is no public fixed-price credit offer on the homepage; credits are purchased inside the practitioner workspace. Current local case-study additions were not observed in the live navigation and are not used as deployed evidence. No acquisition or purchase performance is inferred from the landing page.

New screenshots: `brandit-public-home.jpg`, `brandit-public-services.jpg`, `brandit-public-booking.jpg`. The opening note now explicitly lists evidence gaps and offers a supplementary assignment.
