# Gabeln Studio Lead Qualification Form — Fields & Questions

This document outlines the complete sequence of screens, questions, input types, options, dynamic interpolation rules, and internal scoring logic for the Gabeln Studio lead qualification form (`form.gabelnstudio.com`).

---

## Screen 1: Contact & Business Basics
- **Step ID**: `profile`
- **Kicker**: `Before we get on a call`
- **Headline**: `Let’s start with a few quick basics.`
- **Fields**:
  1. **Your name** (`name`)
     - Type: Text input (`placeholder="e.g. Sarah"`)
     - Required: Yes
  2. **Email address** (`email`)
     - Type: Email input (`placeholder="you@business.com"`)
     - Validation: Standard regex email validation (`isValidEmail`)
     - Required: Yes
  3. **Phone number** (`phone`)
     - Type: Tel input (`placeholder="+62 812 3456 7890"`)
     - Layout: Displayed side-by-side with Email address on desktop
     - Required: Yes
  4. **Business name** (`business`)
     - Type: Text input (`placeholder="e.g. Kasa Villa"`)
     - Usage: Interpolated into questions in subsequent screens
     - Required: Yes
  5. **Instagram handle or website** (`handle`)
     - Type: Text input (`placeholder="@yourbrand or yourbrand.com"`)
     - Required: Yes

---

## Screen 2: Role at Business
- **Step ID**: `role`
- **Headline**: `What’s your role at <business>?`
  - *Interpolation*: Dynamically inserts `answers.business` (fallback: `"your business"`).
- **Options**:
  - `Owner / Founder`
  - `Marketing or Brand Manager`
  - `Other` *(triggers `roleOther` text input: `"Tell us more"`)*
- **Internal Scoring**:
  - `Owner / Founder` → **Strong Fit**
  - `Marketing or Brand Manager` → **Moderate Fit**
  - `Other` → **Needs Qualification**

---

## Screen 3: Service Exploration
- **Step ID**: `service`
- **Headline**: `What are you exploring for <business>?`
  - *Interpolation*: Dynamically inserts `answers.business` (fallback: `"your business"`).
- **Options Layout** (4-tier balanced grid):
  1. `Web Design & Development` *(Row 1: Full-width)*
  2. `Branding` & `IT Solution` *(Row 2: 50% / 50% split)*
  3. `Digital Infrastructure` & `E-Commerce` *(Row 3: 50% / 50% split)*
  4. `Other` *(Row 4: Full-width, triggers `serviceOther` text input: `"Tell us more"`)*
- **Usage**: Selected service is passed into Screens 4, 5, and 7.

---

## Screen 4: Mindset & Curiosity
- **Step ID**: `curiosity`
- **Headline**: `When it comes to <service>, what’s on your mind most right now?`
  - *Interpolation*: Dynamically inserts selected service (or custom value from `serviceOther`).
- **Options**:
  - `How we'd approach it`
  - `What it typically costs`
  - `What results to expect`
  - `Other` *(triggers `curiosityOther` text input: `"Tell us more"`)*

---

## Screen 5: Desired Outcome
- **Step ID**: `outcome`
- **Headline**: `If you moved forward with <service>, what outcome would make it worth it?`
  - *Interpolation*: Dynamically inserts selected service.
- **Options**:
  - `More leads or inquiries`
  - `Stronger brand perception`
  - `Business scale`
  - `Revenue growth`
  - `Other` *(triggers `outcomeOther` text input: `"Tell us more"`)*
- **Usage**: Selected outcome is passed into Screens 6 and 7.

---

## Screen 6: Timeline
- **Step ID**: `timeline`
- **Headline**: `When would you like to start seeing <outcome>?`
  - *Interpolation*: Dynamically inserts selected outcome (or custom value from `outcomeOther`).
- **Options**:
  - `< 3 months`
  - `3–6 months`
  - `6 months – 1 year`
  - `> 1 year`
- **Internal Scoring**:
  - `< 3 months` or `3–6 months` → **Fast / Actionable**
  - `> 1 year` → **Low Urgency**

---

## Screen 7: Investment / Budget
- **Step ID**: `budget`
- **Headline**: `To get <outcome> from <service>, what investment feels reasonable right now?`
  - *Interpolation*: Dynamically inserts both `<outcome>` and `<service>`.
- **Options**:
  - `Under IDR 20mio`
  - `IDR 20–50mio`
  - `IDR 50–100mio`
  - `IDR 100mio+`
- **Internal Scoring**:
  - `IDR 50–100mio` or `IDR 100mio+` → **Qualified Lead (GREEN)**
  - `IDR 20–50mio` → **Potential Lead (YELLOW)**
  - `Under IDR 20mio` → **Below Minimum Retainer (RED)**

---

## Background & Security Features

| Feature | Details |
|---|---|
| **Honeypot Anti-Spam** | Hidden field `company_website_hp` (off-screen, `tabIndex={-1}`). Submissions with text here are silently dropped with an HTTP 200 to confuse scrapers. |
| **Silent Lead Scoring** | Calculates composite score (`GREEN`, `YELLOW`, `RED`) server-side; included in the internal admin email and Firestore document. Never exposed to prospect. |
| **Persistence (Firestore)** | Saved under collection `leads` with server timestamp, client IP, user agent, and all responses. |
| **Email Dispatch (SMTP)** | Sends dual emails: internal team notification to `info.gabelnstudio@gmail.com` and branded confirmation to the prospect. |
