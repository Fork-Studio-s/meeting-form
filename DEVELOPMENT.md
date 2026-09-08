# Gabeln Lead Form — Development Documentation

This file exists so a future AI assistant or developer can pick up this codebase and make changes without silently breaking scoring, validation, or email content. Read this before editing anything, not after something looks wrong.

## What this is

A single-page, screen-per-question intake form for form.gabelnstudio.com. A prospect who's agreed to a discovery call fills it in first. On submit, the studio gets an internal email with the full response and an automatic GREEN/YELLOW/RED priority tag; the prospect gets a short confirmation email. The prospect never sees their own tag.

## Stack and constraints

- Next.js 14, App Router, plain JavaScript (no TypeScript, no build step surprises)
- Database: Cloud Firestore via Firebase Admin SDK. Every submission is permanently persisted to the `leads` collection with server timestamps and lead scores.
- Email via Nodemailer + Gmail SMTP with an App Password, not a transactional email service like Resend or Postmark. This was a deliberate choice, not an oversight — see "Design decisions" below.
- Plain CSS with variables in `app/globals.css`. No Tailwind, no CSS framework.
- English only, no i18n.

## File map

| File | Purpose |
|---|---|
| `app/page.js` | The entire frontend: the `STEPS` config that defines every question, the step-rendering components, and all client-side state, validation, and navigation |
| `app/api/submit/route.js` | The backend logic: validates payload, persists to Firestore, scores the lead, builds and sends both emails |
| `lib/firebase.js` | Firebase Admin SDK initialization helper |
| `app/globals.css` | All styling, via CSS variables in `:root` |
| `app/layout.js` | Next.js root layout — page title and meta description only |
| `README.md` | Setup and deployment instructions (Gmail App Password, Vercel, DNS) |
| `.env.example` | Template for required environment variables |


## Data flow

1. `STEPS` in `app/page.js` defines every screen, in order, as plain data.
2. Answers accumulate in one flat client-side object, `answers`, keyed by each step's `id`.
3. On the last step, the entire `answers` object is POSTed as JSON to `/api/submit`.
4. The route validates required fields are present, runs `scoreLead()` to compute GREEN/YELLOW/RED, then sends two emails through the same Nodemailer transporter: an internal notification (to the studio inbox, tagged with the score) and a confirmation (to the submitter).

## The most important thing to know: the two files are not connected by code

There is no shared import between `app/page.js` and `app/api/submit/route.js`. They're two independent files that only agree by convention — the field names and the exact option text. Nothing enforces that agreement. Change one side without the other and nothing throws an error; it just quietly misbehaves (wrong score, a dropped answer in the email, or a field that's answerable but never checked).

This is the single biggest risk for an edit that looks correct but isn't.

### Places that must stay in sync

| Change this in `app/page.js`... | ...and you must also update this in `app/api/submit/route.js` |
|---|---|
| A step's `id` | `REQUIRED_FIELDS`, the `FREE_TEXT_TRIGGERS` map (if that step has one), any direct reference inside `scoreLead()`, the row list in `buildInternalEmailHtml()` |
| An option's exact text, e.g. `'6 months – 1 year'` | `LOW_BUDGET_VALUE` and `LONG_TIMELINE_VALUES` in `scoreLead()`, if that exact string is one being matched against |
| A step's `freeTextTriggers` value | The matching key/value in `FREE_TEXT_TRIGGERS` inside `route.js` — miss this and the typed follow-up silently vanishes from the internal email, only the trigger label shows |
| Adding or removing a step entirely | `REQUIRED_FIELDS`, and whether `scoreLead()` should factor the new field in |

One easy silent break: `'6 months – 1 year'` and `'3–6 months'` use an en dash (`–`), not a hyphen (`-`). If either string gets retyped with a regular hyphen anywhere, it stops matching and `scoreLead()` stops catching it — no error, no warning, it just always falls through to the next branch.

## Design decisions (do not "fix" these without checking first)

- **No auto-advance.** An earlier version advanced to the next screen automatically after an option was selected. It was deliberately removed on request — the flow is now select an option, then click Continue, as two separate actions. Don't reintroduce auto-advance as a UX improvement without checking; it was tried and reversed on purpose.
- **`freeTextTriggers` is an array of trigger values per step, not a single boolean.** An earlier version used a boolean `allowOther` flag that only ever checked for the literal string `'Other'`. That's exactly why the Role step's "Other" option didn't show a text box in an earlier build — the flag was never set on that step. `freeTextTriggers` generalizes this so any option can reveal a follow-up field, configured on each step (such as "Other" on role, service, curiosity, and outcome).
- **Gmail SMTP, not a transactional email service.** The studio specifically wants the literal "from" address to be info.gabelnstudio@gmail.com. Services like Resend require domain verification (SPF/DKIM) to send from a custom address, and nobody can verify ownership of gmail.com. Nodemailer with a Gmail App Password sends directly through Gmail's own servers, which satisfies that requirement exactly. The tradeoff is Gmail's roughly 500-emails/day cap — a non-issue at current lead volume, worth revisiting only if that changes.
- **Honeypot, not CAPTCHA.** A hidden field (`company_website_hp`) filters basic bots without adding friction for real people. Don't swap in a CAPTCHA unless spam actually becomes a real problem.
- **System fonts, not a webfont.** No `next/font/google` import, so there's no build-time network dependency. Headings and body use the system sans-serif font stack (`--font-sans`). Dynamic headline context inserted from previous steps is styled with medium weight (`.dynamic-context`).
- **Scoring is silent by design.** The prospect never sees their GREEN/YELLOW/RED tag — it only appears in the internal notification email. Don't surface it in the confirmation email or anywhere in the UI.

## Known gaps (not bugs — just not built)

- No rate limiting or CAPTCHA beyond the honeypot.
- No persistent storage or retry queue. If the email send fails, the submission is lost.
- The API only checks that the base fields in `REQUIRED_FIELDS` are present. It does not re-verify that a free-text follow-up was filled in when a trigger value was selected — that check only happens client-side, in `isStepValid`. Someone posting directly to `/api/submit` (bypassing the UI) could submit `service: "Other"` with no `serviceOther` text and it would go through.
- English only.

## How to make common changes safely

**Reword or reorder a question:** Edit `STEPS` in `app/page.js` only. Nothing else needs to change unless the wording change also changes an option's exact text (see the sync table above).

**Add an option to an existing question:** Add it to that step's `options` array in `page.js`. No `route.js` change needed unless `scoreLead()` should treat that new option specially.

**Add a new question or profile field:** Add it to `STEPS` or `ProfileStep` (and `isStepValid`) in `page.js`, then add its key to `REQUIRED_FIELDS` in `route.js`, and add a row for it in `buildInternalEmailHtml()`.

**Change the budget floor or scoring thresholds:** Edit `LOW_BUDGET_VALUE` / `LONG_TIMELINE_VALUES` inside `scoreLead()` in `route.js`. Copy the option string exactly from `page.js`, including punctuation and dash characters.

**Add a free-text follow-up to a new option:** Add that option's exact string to the relevant step's `freeTextTriggers` array in `page.js`, then add a matching entry to `FREE_TEXT_TRIGGERS` in `route.js` so the typed answer actually appears in the internal email instead of being silently dropped.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GMAIL_USER` | Yes | The Gmail address emails are sent from, and where internal notifications land |
| `GMAIL_APP_PASSWORD` | Yes | 16-character app password — not the account's normal login password. Setup steps are in `README.md` |
| `FIREBASE_PROJECT_ID` | Optional | Firebase Project ID for Firestore lead persistence |
| `FIREBASE_CLIENT_EMAIL` | Optional | Service account email from Firebase console |
| `FIREBASE_PRIVATE_KEY` | Optional | Service account private key for Firestore write access |

