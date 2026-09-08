import nodemailer from 'nodemailer';
import { db, FieldValue } from '../../../lib/firebase';

const REQUIRED_FIELDS = [
  'name',
  'email',
  'phone',
  'business',
  'handle',
  'role',
  'service',
  'curiosity',
  'outcome',
  'timeline',
  'budget',
];

// Budget and timeline values matching both EN and ID
const LOW_BUDGET_VALUES = ['Under IDR 20mio', 'Di bawah IDR 20jt'];
const MANAGER_ROLES = ['Marketing or Brand Manager', 'Marketing atau Brand Manager'];
const LONG_TIMELINE_VALUES = [
  '6 months – 1 year',
  '> 1 year',
  '6 bulan – 1 tahun',
  '> 1 tahun',
];

function scoreLead(data) {
  const lowBudget = LOW_BUDGET_VALUES.includes(data.budget);
  const managerRole = MANAGER_ROLES.includes(data.role);
  const longTimeline = LONG_TIMELINE_VALUES.includes(data.timeline);

  if (lowBudget) {
    return {
      tag: 'RED',
      note: 'Low priority. Keep the call a friendly intro, no proposal follow-up unless something changes live.',
    };
  }
  if (managerRole || longTimeline) {
    return {
      tag: 'YELLOW',
      note: 'Nurture. A real call is worth it, but do not over-invest in prep.',
    };
  }
  return {
    tag: 'GREEN',
    note: 'High priority. Run full discovery, aim to send a proposal within 48 hours.',
  };
}

function escapeHtml(str) {
  return String(str ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

function badgeColor(tag) {
  if (tag === 'GREEN') return '#2e7d32';
  if (tag === 'YELLOW') return '#b8860b';
  return '#b5654a';
}

function buildInternalEmailHtml(data, score) {
  const rows = [
    ['Language', (data.lang || 'en').toUpperCase()],
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Business', data.business],
    ['Instagram / website', data.handle],
    ['Role', data.role],
    ['Service', data.service],
    ['Most curious about', data.curiosity],
    ['Outcome expected', data.outcome],
    ['Timeline', data.timeline],
    ['Budget range', data.budget],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
    <tr>
      <td style="padding:8px 12px;color:#706a62;font-size:13px;border-bottom:1px solid #eee;">${escapeHtml(
        label
      )}</td>
      <td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #eee;"><strong>${escapeHtml(
        value || 'not answered'
      )}</strong></td>
    </tr>`
    )
    .join('');

  return `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <span style="display:inline-block;background:${badgeColor(
        score.tag
      )};color:#fff;padding:6px 14px;border-radius:4px;font-size:13px;font-weight:600;">${
    score.tag
  }</span>
      <p style="color:#444;font-size:14px;margin-top:12px;">${escapeHtml(score.note)}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${rowsHtml}</table>
      <p style="color:#999;font-size:12px;margin-top:20px;">Submitted ${new Date().toLocaleString(
        'en-US',
        { dateStyle: 'medium', timeStyle: 'short' }
      )}</p>
    </div>
  `;
}

function buildConfirmationEmailHtml(data) {
  const firstName = escapeHtml(data.name?.split(' ')[0] || data.name || 'there');
  const businessName = escapeHtml(data.business || 'your business');
  const service = escapeHtml(data.service || 'Design & Development');
  const outcome = escapeHtml(data.outcome || 'growth');
  const isId = data.lang === 'id';

  const headline = isId ? `Makasih, ${firstName}.` : `Thanks, ${firstName}.`;
  const bodyText = isId
    ? `Data kamu tentang <strong style="color:#201e1b;">${businessName}</strong> sudah kami terima. Tim kami sedang meninjau detail intake kamu dan akan segera menghubungi untuk mengatur waktu sesi.`
    : `We&rsquo;ve got what we need about <strong style="color:#201e1b;">${businessName}</strong>. Our team is reviewing your intake details and will follow up shortly to lock in a time to talk.`;

  const labelExploring = isId ? 'Layanan yang diexplore' : 'Exploring';
  const labelOutcome = isId ? 'Hasil yang diharapkan' : 'Target Outcome';
  const replyNote = isId
    ? 'Kalau ada konteks tambahan yang ingin kamu bagikan sebelum sesi, langsung balas saja email ini.'
    : 'If anything comes to mind before our call or you&rsquo;d like to share extra context, just reply directly to this email.';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background-color:#e5e5e5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#e5e5e5;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:500px;background-color:#ffffff;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
                <!-- Card Content -->
                <tr>
                  <td style="padding:36px 32px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#2c3e63;">Gabeln Studio &bull; Intake Received</p>
                    <h1 style="margin:0 0 18px;font-size:22px;font-weight:500;color:#201e1b;line-height:1.3;">${headline}</h1>
                    <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:#6e685f;">
                      ${bodyText}
                    </p>

                    <!-- Summary Card -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f7f7f7;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <div style="font-size:12px;color:#919191;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">${labelExploring}</div>
                          <div style="font-size:14px;font-weight:600;color:#201e1b;margin-bottom:12px;">${service}</div>
                          <div style="font-size:12px;color:#919191;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">${labelOutcome}</div>
                          <div style="font-size:14px;font-weight:600;color:#201e1b;">${outcome}</div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#6e685f;">
                      ${replyNote}
                    </p>

                    <div style="border-top:1px solid #eee;padding-top:20px;">
                      <p style="margin:0 0 6px;font-size:14px;color:#201e1b;font-weight:600;">Gabeln Studio</p>
                      <p style="margin:0 0 6px;font-size:12px;color:#919191;line-height:1.5;">International Digital-First Web Design Studio based in Bandung, Indonesia.</p>
                      <p style="margin:0 0 4px;font-size:12px;"><a href="https://gabelnstudio.com" style="color:#2c3e63;text-decoration:none;">gabelnstudio.com</a></p>
                      <p style="margin:0;font-size:12px;color:#919191;">+62 895-3091-0379</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Bots often do.
  if (data.company_website_hp) {
    return Response.json({ ok: true });
  }

  const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
  if (missing.length > 0) {
    return Response.json(
      { error: `Missing required field(s): ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ error: 'That email address does not look valid.' }, { status: 400 });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.');
    return Response.json(
      { error: 'Email is not configured yet. Please try again later.' },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const score = scoreLead(data);

  // Save lead document to Firebase Firestore
  if (db) {
    try {
      await db.collection('leads').add({
        lang: data.lang || 'en',
        name: data.name,
        email: data.email,
        phone: data.phone,
        business: data.business,
        handle: data.handle,
        role: data.role,
        service: data.service,
        curiosity: data.curiosity,
        outcome: data.outcome,
        timeline: data.timeline,
        budget: data.budget,
        scoreTag: score.tag,
        scoreNote: score.note,
        submittedAt: FieldValue.serverTimestamp(),
      });
    } catch (dbErr) {
      console.error('Firestore save error:', dbErr);
    }
  }

  try {
    const subjectPrefix = data.lang === 'id' ? '[ID]' : '[EN]';
    await transporter.sendMail({
      from: `Gabeln Studio Form <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: data.email,
      subject: `${subjectPrefix} New lead: ${data.business} (${score.tag})`,
      html: buildInternalEmailHtml(data, score),
    });

    const confirmSubject =
      data.lang === 'id'
        ? `Info kamu sudah kami terima, ${data.name}`
        : `We've got your info, ${data.name}`;

    await transporter.sendMail({
      from: `Gabeln Studio <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: confirmSubject,
      html: buildConfirmationEmailHtml(data),
    });
  } catch (err) {
    console.error('Email send failed:', err);
    return Response.json(
      { error: 'Failed to send. Please try again in a moment.' },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
