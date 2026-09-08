'use client';

import { useState, useCallback } from 'react';

const T = {
  en: {
    brand: 'Gabeln Studio',
    btn_next: 'Continue',
    btn_back: 'Back',
    btn_submit: 'Submit',
    btn_submitting: 'Sending…',
    ph_other: 'Tell us more',
    fallback_biz: 'your business',
    fallback_svc: 'this',
    fallback_out: 'that result',
    err_req: 'Please complete the fields above.',
    err_email: 'Please enter a valid email address.',
    err_choose: 'Please choose an option.',

    // Step 1: Business
    k1: '01 — Your business',
    h1: 'Tell us about your business.',
    s1: 'Helps us look you up before the call.',
    l_business: 'Business name',
    ph_business: 'e.g. Kasa Villa',
    l_handle: 'Instagram handle or website',
    ph_handle: '@yourbrand or yourbrand.com',

    // Step 2: Role
    k2: '02 — Your role',
    h2_prefix: "What's your role at ",
    h2_suffix: '?',
    options_role: ['Owner / Founder', 'Marketing or Brand Manager', 'Other'],

    // Step 3: Service
    k3: "03 — What you're exploring",
    h3_prefix: 'What are you exploring for ',
    h3_suffix: '?',
    options_service: [
      'Web Design & Development',
      'Branding',
      'IT Solution',
      'Digital Infrastructure',
      'E-Commerce',
      'Other',
    ],

    // Step 4: Curiosity
    k4: '04 — On your mind',
    h4_prefix: 'When it comes to ',
    h4_mid: ", what's on your mind most right now?",
    options_curiosity: [
      "How we'd approach it",
      'What it typically costs',
      'What results to expect',
      'Other',
    ],

    // Step 5: Outcome
    k5: '05 — Desired outcome',
    h5_prefix: 'If you moved forward with ',
    h5_mid: ', what outcome would make it worth it?',
    options_outcome: [
      'More leads or inquiries',
      'Stronger brand perception',
      'Business scale',
      'Revenue growth',
      'Other',
    ],

    // Step 6: Timeline
    k6: '06 — Timeline',
    h6_prefix: 'When would you like to start seeing ',
    h6_suffix: '?',
    options_timeline: ['< 3 months', '3–6 months', '6 months – 1 year', '> 1 year'],

    // Step 7: Budget
    k7: '07 — Investment',
    h7_prefix: 'To get ',
    h7_mid: ' from ',
    h7_suffix: ', what investment feels reasonable right now?',
    options_budget: ['Under IDR 20mio', 'IDR 20–50mio', 'IDR 50–100mio', 'IDR 100mio+'],

    // Step 8: Contact
    k8: '08 — Reaching you',
    h8: 'Where should we send your consultation details?',
    s8: 'This is just for scheduling and sending your strategy plan.',
    l_name: 'Full name',
    ph_name: 'e.g. Sarah',
    l_email: 'Email',
    ph_email: 'you@business.com',
    l_phone: 'Phone / WhatsApp',
    ph_phone: '+62 812 3456 7890',

    // Step 9: Thank You
    k_final: "You're all set.",
    h_final: 'Thanks — see you on the call.',
    s_final:
      "We'll review this before your session so the conversation goes straight to what matters. A confirmation is on its way to your inbox.",
  },
  id: {
    brand: 'Gabeln Studio',
    btn_next: 'Lanjut',
    btn_back: 'Kembali',
    btn_submit: 'Kirim',
    btn_submitting: 'Mengirim…',
    ph_other: 'Ceritain lebih lanjut',
    fallback_biz: 'bisnismu',
    fallback_svc: 'layanan ini',
    fallback_out: 'hasil itu',
    err_req: 'Mohon lengkapi kolom di atas.',
    err_email: 'Mohon masukkan alamat email yang valid.',
    err_choose: 'Mohon pilih salah satu pilihan.',

    // Step 1: Business
    k1: '01 — Bisnismu',
    h1: 'Mulai dari bisnismu ya.',
    s1: 'Biar kita bisa lihat-lihat dulu sebelum sesinya.',
    l_business: 'Nama bisnis',
    ph_business: 'cth. Kasa Villa',
    l_handle: 'Instagram atau website',
    ph_handle: '@yourbrand atau yourbrand.com',

    // Step 2: Role
    k2: '02 — Peranmu',
    h2_prefix: 'Posisi kamu di ',
    h2_suffix: ' apa?',
    options_role: ['Owner / Founder', 'Marketing atau Brand Manager', 'Lainnya'],

    // Step 3: Service
    k3: '03 — Yang lagi dicari',
    h3_prefix: 'Untuk ',
    h3_suffix: ', kamu lagi explore yang mana?',
    options_service: [
      'Web Design & Development',
      'Branding',
      'IT Solution',
      'Digital Infrastructure',
      'E-Commerce',
      'Lainnya',
    ],

    // Step 4: Curiosity
    k4: '04 — Yang lagi dipikirin',
    h4_prefix: 'Soal ',
    h4_mid: ', yang paling kamu pikirin sekarang apa?',
    options_curiosity: [
      'Cara kita approach-nya',
      'Kira-kira biayanya berapa',
      'Hasil yang bisa diharapkan',
      'Lainnya',
    ],

    // Step 5: Outcome
    k5: '05 — Hasil yang diinginkan',
    h5_prefix: 'Kalau kamu lanjut dengan ',
    h5_mid: ', hasil apa yang bikin ini worth it?',
    options_outcome: [
      'Lebih banyak leads atau inquiry',
      'Brand perception lebih kuat',
      'Scale bisnis',
      'Pertumbuhan revenue',
      'Lainnya',
    ],

    // Step 6: Timeline
    k6: '06 — Waktu',
    h6_prefix: 'Kamu pengen mulai lihat ',
    h6_suffix: ' dari kapan?',
    options_timeline: ['< 3 bulan', '3–6 bulan', '6 bulan – 1 tahun', '> 1 tahun'],

    // Step 7: Budget
    k7: '07 — Investasi',
    h7_prefix: 'Untuk dapetin ',
    h7_mid: ' dari ',
    h7_suffix: ', investasi yang masuk akal buat kamu berapa?',
    options_budget: ['Di bawah IDR 20jt', 'IDR 20–50jt', 'IDR 50–100jt', 'IDR 100jt+'],

    // Step 8: Contact
    k8: '08 — Cara kita hubungi',
    h8: 'Ke mana kita kirim detail konsultasinya?',
    s8: 'Ini cuma buat atur jadwal dan kirim ringkasan strategi kamu.',
    l_name: 'Nama lengkap',
    ph_name: 'cth. Sarah',
    l_email: 'Alamat email',
    ph_email: 'kamu@bisnis.com',
    l_phone: 'Nomor telepon / WhatsApp',
    ph_phone: '+62 812 3456 7890',

    // Step 9: Thank You
    k_final: 'Siap!',
    h_final: 'Makasih — sampai ketemu di sesinya.',
    s_final:
      'Kita bakal review ini dulu sebelum sesi, biar obrolannya langsung ke yang penting. Konfirmasi sudah dikirim ke email kamu.',
  },
};

const TOTAL_STEPS = 8;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function FormPage() {
  const [lang, setLang] = useState('en');
  const [stepIndex, setStepIndex] = useState(0); // 0 to 7
  const [answers, setAnswers] = useState({
    business: '',
    handle: '',
    role: null,
    roleOther: '',
    service: null,
    serviceOther: '',
    curiosity: null,
    curiosityOther: '',
    outcome: null,
    outcomeOther: '',
    timeline: null,
    budget: null,
    name: '',
    email: '',
    phone: '+62 ',
    company_website_hp: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const t = T[lang];

  const update = (field, val) => {
    setAnswers((prev) => ({ ...prev, [field]: val }));
  };

  const getBizName = () => answers.business.trim() || t.fallback_biz;

  const getServiceLabel = () => {
    if (answers.service === 'Other' || answers.service === 'Lainnya') {
      return answers.serviceOther.trim() || t.fallback_svc;
    }
    return answers.service || t.fallback_svc;
  };

  const getOutcomeLabel = () => {
    if (answers.outcome === 'Other' || answers.outcome === 'Lainnya') {
      return answers.outcomeOther.trim() || t.fallback_out;
    }
    return answers.outcome || t.fallback_out;
  };

  // Validation per step
  const isStepValid = () => {
    switch (stepIndex) {
      case 0: // Business
        return Boolean(answers.business.trim() && answers.handle.trim());
      case 1: // Role
        if (!answers.role) return false;
        if (answers.role === 'Other' || answers.role === 'Lainnya') {
          return Boolean(answers.roleOther.trim());
        }
        return true;
      case 2: // Service
        if (!answers.service) return false;
        if (answers.service === 'Other' || answers.service === 'Lainnya') {
          return Boolean(answers.serviceOther.trim());
        }
        return true;
      case 3: // Curiosity
        if (!answers.curiosity) return false;
        if (answers.curiosity === 'Other' || answers.curiosity === 'Lainnya') {
          return Boolean(answers.curiosityOther.trim());
        }
        return true;
      case 4: // Outcome
        if (!answers.outcome) return false;
        if (answers.outcome === 'Other' || answers.outcome === 'Lainnya') {
          return Boolean(answers.outcomeOther.trim());
        }
        return true;
      case 5: // Timeline
        return Boolean(answers.timeline);
      case 6: // Budget
        return Boolean(answers.budget);
      case 7: // Contact (final step)
        return Boolean(
          answers.name.trim() &&
            answers.email.trim() &&
            isValidEmail(answers.email.trim()) &&
            answers.phone.trim().length > 4
        );
      default:
        return false;
    }
  };

  const valid = isStepValid();

  // Progress percentage (0% to 100%)
  const progressPct = Math.round((stepIndex / (TOTAL_STEPS - 1)) * 100);

  const goNext = () => {
    if (!valid) return;
    setErrorMsg('');
    setStepIndex((i) => Math.min(i + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setErrorMsg('');
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!valid || status === 'submitting') return;
    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload = {
        lang,
        name: answers.name.trim(),
        email: answers.email.trim(),
        phone: answers.phone.trim(),
        business: answers.business.trim(),
        handle: answers.handle.trim(),
        role:
          answers.role === 'Other' || answers.role === 'Lainnya'
            ? answers.roleOther.trim()
            : answers.role,
        service:
          answers.service === 'Other' || answers.service === 'Lainnya'
            ? answers.serviceOther.trim()
            : answers.service,
        curiosity:
          answers.curiosity === 'Other' || answers.curiosity === 'Lainnya'
            ? answers.curiosityOther.trim()
            : answers.curiosity,
        outcome:
          answers.outcome === 'Other' || answers.outcome === 'Lainnya'
            ? answers.outcomeOther.trim()
            : answers.outcome,
        timeline: answers.timeline,
        budget: answers.budget,
        company_website_hp: answers.company_website_hp,
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }, [answers, lang, status, valid]);

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (stepIndex === TOTAL_STEPS - 1) {
        handleSubmit();
      } else {
        goNext();
      }
    }
  };

  // SUCCESS SCREEN
  if (status === 'success') {
    return (
      <div className="app-shell">
        <div className="topbar">
          <div className="brand">{t.brand}</div>
          <div className="langtoggle">
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'id' ? 'active' : ''}
              onClick={() => setLang('id')}
            >
              ID
            </button>
          </div>
        </div>

        <div className="path">
          <div className="path-fill" style={{ width: '100%' }} />
          <div className="path-marker" style={{ left: '100%' }} />
        </div>

        <div className="screen final-screen">
          <div className="kicker">{t.k_final}</div>
          <h1 className="screen-title">{t.h_final}</h1>
          <p className="sub">{t.s_final}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Topbar with Brand and Language Switcher */}
      <div className="topbar">
        <div className="brand">{t.brand}</div>
        <div className="langtoggle">
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === 'id' ? 'active' : ''}
            onClick={() => setLang('id')}
          >
            ID
          </button>
        </div>
      </div>

      {/* Glowing Progress Path */}
      <div className="path">
        <div className="path-fill" style={{ width: `${progressPct}%` }} />
        <div className="path-marker" style={{ left: `${progressPct}%` }} />
      </div>

      {/* Honeypot field for bot suppression */}
      <input
        type="text"
        name="company_website_hp"
        value={answers.company_website_hp}
        onChange={(e) => update('company_website_hp', e.target.value)}
        className="hp-field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Screen 1: Business */}
      {stepIndex === 0 && (
        <div className="screen">
          <div className="kicker">{t.k1}</div>
          <h1 className="screen-title">{t.h1}</h1>
          <p className="sub">{t.s1}</p>
          <div className="field-group">
            <div className="field">
              <label htmlFor="input-business">{t.l_business}</label>
              <input
                id="input-business"
                type="text"
                value={answers.business}
                onChange={(e) => update('business', e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t.ph_business}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="input-handle">{t.l_handle}</label>
              <input
                id="input-handle"
                type="text"
                value={answers.handle}
                onChange={(e) => update('handle', e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t.ph_handle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Screen 2: Role */}
      {stepIndex === 1 && (
        <div className="screen">
          <div className="kicker">{t.k2}</div>
          <h1 className="screen-title">
            {t.h2_prefix}
            <span className="dynamic-highlight">{getBizName()}</span>
            {t.h2_suffix}
          </h1>
          <OptionsSelector
            options={t.options_role}
            selected={answers.role}
            onSelect={(val) => update('role', val)}
            otherVal={answers.roleOther}
            onOtherChange={(val) => update('roleOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 3: Service */}
      {stepIndex === 2 && (
        <div className="screen">
          <div className="kicker">{t.k3}</div>
          <h1 className="screen-title">
            {t.h3_prefix}
            <span className="dynamic-highlight">{getBizName()}</span>
            {t.h3_suffix}
          </h1>
          <OptionsSelector
            options={t.options_service}
            selected={answers.service}
            onSelect={(val) => update('service', val)}
            otherVal={answers.serviceOther}
            onOtherChange={(val) => update('serviceOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 4: Curiosity */}
      {stepIndex === 3 && (
        <div className="screen">
          <div className="kicker">{t.k4}</div>
          <h1 className="screen-title">
            {t.h4_prefix}
            <span className="dynamic-highlight">{getServiceLabel()}</span>
            {t.h4_mid}
          </h1>
          <OptionsSelector
            options={t.options_curiosity}
            selected={answers.curiosity}
            onSelect={(val) => update('curiosity', val)}
            otherVal={answers.curiosityOther}
            onOtherChange={(val) => update('curiosityOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 5: Outcome */}
      {stepIndex === 4 && (
        <div className="screen">
          <div className="kicker">{t.k5}</div>
          <h1 className="screen-title">
            {t.h5_prefix}
            <span className="dynamic-highlight">{getServiceLabel()}</span>
            {t.h5_mid}
          </h1>
          <OptionsSelector
            options={t.options_outcome}
            selected={answers.outcome}
            onSelect={(val) => update('outcome', val)}
            otherVal={answers.outcomeOther}
            onOtherChange={(val) => update('outcomeOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 6: Timeline */}
      {stepIndex === 5 && (
        <div className="screen">
          <div className="kicker">{t.k6}</div>
          <h1 className="screen-title">
            {t.h6_prefix}
            <span className="dynamic-highlight">{getOutcomeLabel()}</span>
            {t.h6_suffix}
          </h1>
          <OptionsSelector
            options={t.options_timeline}
            selected={answers.timeline}
            onSelect={(val) => update('timeline', val)}
            hasOther={false}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 7: Budget */}
      {stepIndex === 6 && (
        <div className="screen">
          <div className="kicker">{t.k7}</div>
          <h1 className="screen-title">
            {t.h7_prefix}
            <span className="dynamic-highlight">{getOutcomeLabel()}</span>
            {t.h7_mid}
            <span className="dynamic-highlight">{getServiceLabel()}</span>
            {t.h7_suffix}
          </h1>
          <OptionsSelector
            options={t.options_budget}
            selected={answers.budget}
            onSelect={(val) => update('budget', val)}
            hasOther={false}
            onEnter={goNext}
          />
        </div>
      )}

      {/* Screen 8: Contact Capture (Matches Reference Screenshot) */}
      {stepIndex === 7 && (
        <div className="screen">
          <div className="kicker">{t.k8}</div>
          <h1 className="screen-title">{t.h8}</h1>
          <p className="sub">{t.s8}</p>
          <div className="field-group">
            <div className="field">
              <label htmlFor="input-name">{t.l_name}</label>
              <input
                id="input-name"
                type="text"
                value={answers.name}
                onChange={(e) => update('name', e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t.ph_name}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="input-email">{t.l_email}</label>
              <input
                id="input-email"
                type="email"
                value={answers.email}
                onChange={(e) => update('email', e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t.ph_email}
              />
            </div>
            <div className="field">
              <label htmlFor="input-phone">{t.l_phone}</label>
              <input
                id="input-phone"
                type="tel"
                value={answers.phone}
                onChange={(e) => update('phone', e.target.value)}
                onKeyDown={handleEnterKey}
                placeholder={t.ph_phone}
              />
            </div>
          </div>
        </div>
      )}

      {errorMsg && <p className="errmsg">{errorMsg}</p>}

      {/* Navigation Actions */}
      <div className="nav-actions">
        {stepIndex > 0 ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={goBack}
            disabled={status === 'submitting'}
          >
            {t.btn_back}
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          className="btn-primary"
          onClick={stepIndex === TOTAL_STEPS - 1 ? handleSubmit : goNext}
          disabled={!valid || status === 'submitting'}
        >
          {status === 'submitting'
            ? t.btn_submitting
            : stepIndex === TOTAL_STEPS - 1
            ? t.btn_submit
            : t.btn_next}
        </button>
      </div>
    </div>
  );
}

function OptionsSelector({
  options,
  selected,
  onSelect,
  hasOther = true,
  otherVal = '',
  onOtherChange,
  otherPlaceholder = 'Tell us more',
  onEnter,
}) {
  const isOtherSelected =
    hasOther && (selected === 'Other' || selected === 'Lainnya');

  return (
    <div className="options-list">
      {options.map((opt, idx) => {
        const isSelected = selected === opt;
        const isLastItem = hasOther && idx === options.length - 1;

        return (
          <button
            key={opt}
            type="button"
            className={`opt-row ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            <div className="mark" />
            <div className="opt-label">{opt}</div>
          </button>
        );
      })}

      {isOtherSelected && (
        <div className="other-wrap">
          <input
            type="text"
            value={otherVal}
            onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onEnter && onEnter();
              }
            }}
            placeholder={otherPlaceholder}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
