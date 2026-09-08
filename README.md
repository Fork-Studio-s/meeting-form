# Gabeln Studio — Lead Qualification Form

Self-hosted intake form for form.gabelnstudio.com. Screen-per-question flow, no database, no third-party form tool. Submissions go out as email.

## What it does

- Walks a prospect through 7 short screens: profile, role, service, curiosity, outcome, timeline, budget
- On submit, emails the full response to info.gabelnstudio@gmail.com with an automatic GREEN / YELLOW / RED priority tag
- Sends the prospect a short confirmation email from info.gabelnstudio@gmail.com
- The prospect never sees their own priority tag — scoring is internal only

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` (see step 2), then:

```bash
npm run dev
```

Visit http://localhost:3000.

## 2. Gmail App Password (required before any email will send)

The form sends real email from info.gabelnstudio@gmail.com using Gmail's own SMTP servers. Gmail blocks login from outside apps with your normal password, so you need an "app password" instead:

1. Sign in to myaccount.google.com as info.gabelnstudio@gmail.com
2. Turn on **2-Step Verification** if it isn't already on — app passwords won't appear until it is
3. Go to myaccount.google.com/apppasswords
4. Create a new app password, name it "Gabeln Form"
5. Copy the 16-character code (no spaces)
6. Set:
   - `GMAIL_USER=info.gabelnstudio@gmail.com`
   - `GMAIL_APP_PASSWORD=` (the 16-character code)

Regular Gmail accounts cap around 500 sends/day, far above what this form will ever need.

## 3. Deploy

Push this folder to a GitHub repo, then import it into Vercel (or any Node host that runs Next.js).

Set the same two environment variables from step 2 in your hosting provider's dashboard.

## 4. Point form.gabelnstudio.com at it

In Vercel: Project → Settings → Domains → add `form.gabelnstudio.com`. Vercel will show a CNAME target (usually `cname.vercel-dns.com` — use exactly what it shows you).

In your DNS provider for gabelnstudio.com, add:

| Type  | Name | Value                     |
| ----- | ---- | -------------------------- |
| CNAME | form | (whatever Vercel shows you) |

SSL is issued automatically once DNS resolves, usually within a few minutes to a couple of hours.

## Editing the questions

All question text, options, and order live in the `STEPS` array at the top of `app/page.js`. It's plain data — no need to touch the rendering logic to reword a question or change an option.

## Tuning the priority scoring

The GREEN / YELLOW / RED logic lives in `scoreLead()` inside `app/api/submit/route.js`. "Under IDR 20mio" currently triggers RED, matching the studio's documented local minimum. A Marketing/Brand Manager role or a timeline of 6 months or longer triggers YELLOW. Adjust as real budget data comes in, or split the threshold by service if E-Commerce and Web Design end up needing different floors.

## Spam protection

There's a hidden honeypot field (`company_website_hp`) real visitors never see. If it's filled in on submit, the request is silently dropped — no CAPTCHA, to keep friction at zero. If spam becomes a real problem later, Cloudflare Turnstile is the natural next step.
