# Gabeln Studio Lead Qualification Form — Fields & Flow

This document outlines the complete sequence of screens, questions, input types, options, dynamic interpolation rules, and internal scoring logic for the Gabeln Studio lead qualification form (`form.gabelnstudio.com`).

---

## Screen Sequence (Low-Friction 8-Step Flow)

### Screen 1: Business & Presence (`01 — Your business` / `01 — Bisnismu`)
- **Step ID**: `business`
- **Kicker**: `01 — Your business` (EN) / `01 — Bisnismu` (ID)
- **Headline**: `Tell us about your business.` / `Mulai dari bisnismu ya.`
- **Subtitle**: `Helps us look you up before the call.` / `Biar kita bisa lihat-lihat dulu sebelum sesinya.`
- **Fields**:
  1. **Business name** (`business`)
     - Type: Text input (`placeholder="e.g. Kasa Villa"` / `"cth. Kasa Villa"`)
     - Usage: Interpolated into questions in subsequent screens
     - Required: Yes
  2. **Instagram handle or website** (`handle`)
     - Type: Text input (`placeholder="@yourbrand or yourbrand.com"`)
     - Required: Yes

---

### Screen 2: Role at Business (`02 — Your role` / `02 — Peranmu`)
- **Step ID**: `role`
- **Headline**: `What’s your role at <business>?` / `Posisi kamu di <business> apa?`
  - *Interpolation*: Dynamically inserts `business` (fallback: `"your business"` / `"bisnismu"`).
- **Options**:
  - `Owner / Founder`
  - `Marketing or Brand Manager` / `Marketing atau Brand Manager`
  - `Other` / `Lainnya` *(triggers text input: `"Tell us more"` / `"Ceritain lebih lanjut"`)*
- **Internal Scoring**:
  - `Owner / Founder` → **Strong Fit**
  - `Marketing or Brand Manager` → **Moderate Fit (YELLOW)**
  - `Other` → **Evaluated with budget/timeline**

---

### Screen 3: Service Exploration (`03 — What you're exploring` / `03 — Yang lagi dicari`)
- **Step ID**: `service`
- **Headline**: `What are you exploring for <business>?` / `Untuk <business>, kamu lagi explore yang mana?`
- **Options**:
  - `Web Design & Development`
  - `Branding`
  - `IT Solution`
  - `Digital Infrastructure`
  - `E-Commerce`
  - `Other` / `Lainnya` *(triggers text input: `"Tell us more"` / `"Ceritain lebih lanjut"`)*
- **Usage**: Selected service is passed into Screens 4, 5, and 7.

---

### Screen 4: Mindset & Curiosity (`04 — On your mind` / `04 — Yang lagi dipikirin`)
- **Step ID**: `curiosity`
- **Headline**: `When it comes to <service>, what’s on your mind most right now?` / `Soal <service>, yang paling kamu pikirin sekarang apa?`
  - *Interpolation*: Dynamically inserts selected service.
- **Options**:
  - `How we'd approach it` / `Cara kita approach-nya`
  - `What it typically costs` / `Kira-kira biayanya berapa`
  - `What results to expect` / `Hasil yang bisa diharapkan`
  - `Other` / `Lainnya` *(triggers text input: `"Tell us more"` / `"Ceritain lebih lanjut"`)*

---

### Screen 5: Desired Outcome (`05 — Desired outcome` / `05 — Hasil yang diinginkan`)
- **Step ID**: `outcome`
- **Headline**: `If you moved forward with <service>, what outcome would make it worth it?` / `Kalau kamu lanjut dengan <service>, hasil apa yang bikin ini worth it?`
  - *Interpolation*: Dynamically inserts selected service.
- **Options**:
  - `More leads or inquiries` / `Lebih banyak leads atau inquiry`
  - `Stronger brand perception` / `Brand perception lebih kuat`
  - `Business scale` / `Scale bisnis`
  - `Revenue growth` / `Pertumbuhan revenue`
  - `Other` / `Lainnya` *(triggers text input: `"Tell us more"` / `"Ceritain lebih lanjut"`)*
- **Usage**: Selected outcome is passed into Screens 6 and 7.

---

### Screen 6: Timeline (`06 — Timeline` / `06 — Waktu`)
- **Step ID**: `timeline`
- **Headline**: `When would you like to start seeing <outcome>?` / `Kamu pengen mulai lihat <outcome> dari kapan?`
  - *Interpolation*: Dynamically inserts selected outcome.
- **Options**:
  - `< 3 months` / `< 3 bulan`
  - `3–6 months` / `3–6 bulan`
  - `6 months – 1 year` / `6 bulan – 1 tahun`
  - `> 1 year` / `> 1 tahun`
- **Internal Scoring**:
  - `< 3 months` or `3–6 months` → **Fast / Actionable**
  - `6 months – 1 year` or `> 1 year` → **YELLOW**

---

### Screen 7: Investment / Budget (`07 — Investment` / `07 — Investasi`)
- **Step ID**: `budget`
- **Headline**: `To get <outcome> from <service>, what investment feels reasonable right now?` / `Untuk dapetin <outcome> dari <service>, investasi yang masuk akal buat kamu berapa?`
  - *Interpolation*: Dynamically inserts both `<outcome>` and `<service>`.
- **Options**:
  - `Under IDR 20mio` / `Di bawah IDR 20jt`
  - `IDR 20–50mio` / `IDR 20–50jt`
  - `IDR 50–100mio` / `IDR 50–100jt`
  - `IDR 100mio+` / `IDR 100jt+`
- **Internal Scoring**:
  - `Under IDR 20mio` / `Di bawah IDR 20jt` → **Below Minimum Retainer (RED)**
  - `IDR 20–50mio` → **Potential Lead (YELLOW)**
  - `IDR 50–100mio` or `IDR 100mio+` → **Qualified Lead (GREEN)**

---

### Screen 8: Contact Capture (`08 — Reaching you` / `08 — Cara kita hubungi`)
*Matches the reference design:*
- **Step ID**: `contact`
- **Kicker**: `08 — Reaching you` (EN) / `08 — Cara kita hubungi` (ID)
- **Headline**: `Where should we send your consultation details?` / `Ke mana kita kirim detail konsultasinya?`
- **Subtitle**: `This is just for scheduling and sending your strategy plan.` / `Ini cuma buat atur jadwal dan kirim ringkasan strategi kamu.`
- **Fields**:
  1. **Full name** (`name`) — Text input (`placeholder="e.g. Sarah"` / `"cth. Sarah"`)
  2. **Email** (`email`) — Email input (`placeholder="you@business.com"` / `"kamu@bisnis.com"`)
  3. **Phone / WhatsApp** (`phone`) — Tel input (`placeholder="+62 812 3456 7890"`, pre-filled with `+62 `)
- **Actions**:
  - `Back` (ghost button on left)
  - `Submit` (gold pill button on right)

---

### Screen 9: Thank You / All Set
- **Kicker**: `You're all set.` / `Siap!`
- **Headline**: `Thanks — see you on the call.` / `Makasih — sampai ketemu di sesinya.`
- **Subtitle**: `We'll review this before your session so the conversation goes straight to what matters. A confirmation is on its way to your inbox.` / `Kita bakal review ini dulu sebelum sesi, biar obrolannya langsung ke yang penting. Konfirmasi sudah dikirim ke email kamu.`

---

## Technical Features

| Feature | Details |
|---|---|
| **Bilingual Support (EN / ID)** | Instant top-bar pill toggle without page reloads. |
| **Aesthetic System** | Luxury dark studio palette: Ink `#15161B`, Bone `#EFE9DC`, Gold `#D9A441`, Newsreader serif & Space Grotesk sans. |
| **Progress Path** | Animated progress bar with glowing gold tracking point. |
| **Honeypot Anti-Spam** | Hidden field `company_website_hp` (off-screen). Submissions with text are silently dropped with HTTP 200. |
| **Firestore Persistence** | Saves all fields, server timestamp, and language `lang` under collection `leads`. |
| **Dual Nodemailer Dispatch** | Sends internal scored lead alert to `info.gabelnstudio@gmail.com` and branded confirmation email to the prospect. |
