'use client';

import { useState, useCallback } from 'react';

const DICT = {
  en: {
    btn_next: 'Continue',
    btn_back: 'Back',
    btn_submit: 'Submit',
    btn_submitting: 'Sending…',
    ph_other: 'Tell us more',
    fallback_biz: 'your business',
    fallback_svc: 'this',
    fallback_out: 'that',

    // Screen 1: Business
    k1: '01 — Your business',
    h1: 'Tell us about your business.',
    s1: 'Helps us look you up before the call.',
    l_business: 'Business name',
    ph_business: 'e.g. Kasa Villa',
    l_handle: 'Instagram handle or website',
    ph_handle: '@yourbrand or yourbrand.com',

    // Screen 2: Role
    k2: '02 — Your role',
    h2_prefix: "What's your role at ",
    h2_suffix: '?',
    options_role: ['Owner / Founder', 'Marketing or Brand Manager', 'Other'],

    // Screen 3: Service
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

    // Screen 4: Curiosity
    k4: '04 — On your mind',
    h4_prefix: 'When it comes to ',
    h4_mid: ", what's on your mind most right now?",
    options_curiosity: [
      "How we'd approach it",
      'What it typically costs',
      'What results to expect',
      'Other',
    ],

    // Screen 5: Outcome
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

    // Screen 6: Timeline
    k6: '06 — Timeline',
    h6_prefix: 'When would you like to start seeing ',
    h6_suffix: '?',
    options_timeline: ['< 3 months', '3–6 months', '6 months – 1 year', '> 1 year'],

    // Screen 7: Budget
    k7: '07 — Investment',
    h7_prefix: 'To get ',
    h7_mid: ' from ',
    h7_suffix: ', what investment feels reasonable right now?',
    options_budget: ['Under IDR 20mio', 'IDR 20–50mio', 'IDR 50–100mio', 'IDR 100mio+'],

    // Screen 8: Contact
    k8: '08 — Reaching you',
    h8: 'Where should we send your consultation details?',
    s8: 'This is just for scheduling and sending your strategy plan.',
    l_name: 'Full name',
    ph_name: 'e.g. Sarah',
    l_email: 'Email address',
    ph_email: 'you@business.com',
    l_phone: 'Phone / WhatsApp',
    ph_phone: '+62 812 3456 7890',

    // Success
    k_success: 'All set',
    h_success_prefix: 'Thanks, ',
    s_success_prefix: "We've got what we need about ",
    s_success_mid: '. A confirmation is on its way to ',
    s_success_suffix: ", and we'll follow up shortly to lock in a time to talk.",
  },
  id: {
    btn_next: 'Lanjut',
    btn_back: 'Kembali',
    btn_submit: 'Kirim',
    btn_submitting: 'Mengirim…',
    ph_other: 'Ceritain lebih lanjut',
    fallback_biz: 'bisnismu',
    fallback_svc: 'layanan ini',
    fallback_out: 'hasil itu',

    // Screen 1: Business
    k1: '01 — Bisnismu',
    h1: 'Mulai dari bisnismu ya.',
    s1: 'Biar kita bisa lihat-lihat dulu sebelum sesinya.',
    l_business: 'Nama bisnis',
    ph_business: 'cth. Kasa Villa',
    l_handle: 'Instagram atau website',
    ph_handle: '@yourbrand atau yourbrand.com',

    // Screen 2: Role
    k2: '02 — Peranmu',
    h2_prefix: 'Posisi kamu di ',
    h2_suffix: ' apa?',
    options_role: ['Owner / Founder', 'Marketing atau Brand Manager', 'Lainnya'],

    // Screen 3: Service
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

    // Screen 4: Curiosity
    k4: '04 — Yang lagi dipikirin',
    h4_prefix: 'Soal ',
    h4_mid: ', yang paling kamu pikirin sekarang apa?',
    options_curiosity: [
      'Cara kita approach-nya',
      'Kira-kira biayanya berapa',
      'Hasil yang bisa diharapkan',
      'Lainnya',
    ],

    // Screen 5: Outcome
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

    // Screen 6: Timeline
    k6: '06 — Waktu',
    h6_prefix: 'Kamu pengen mulai lihat ',
    h6_suffix: ' dari kapan?',
    options_timeline: ['< 3 bulan', '3–6 bulan', '6 bulan – 1 tahun', '> 1 tahun'],

    // Screen 7: Budget
    k7: '07 — Investasi',
    h7_prefix: 'Untuk dapetin ',
    h7_mid: ' dari ',
    h7_suffix: ', investasi yang masuk akal buat kamu berapa?',
    options_budget: ['Di bawah IDR 20jt', 'IDR 20–50jt', 'IDR 50–100jt', 'IDR 100jt+'],

    // Screen 8: Contact
    k8: '08 — Cara kita hubungi',
    h8: 'Ke mana kita kirim detail konsultasinya?',
    s8: 'Ini cuma buat atur jadwal dan kirim ringkasan strategi kamu.',
    l_name: 'Nama lengkap',
    ph_name: 'cth. Sarah',
    l_email: 'Alamat email',
    ph_email: 'kamu@bisnis.com',
    l_phone: 'Nomor telepon / WhatsApp',
    ph_phone: '+62 812 3456 7890',

    // Success
    k_success: 'Siap!',
    h_success_prefix: 'Makasih, ',
    s_success_prefix: 'Data kamu tentang ',
    s_success_mid: ' sudah kami terima. Konfirmasi sudah dikirim ke ',
    s_success_suffix: ', dan tim kita akan segera menghubungi untuk mengatur waktu sesi.',
  },
};

const STEPS = [
  { id: 'business', kind: 'business' },
  { id: 'role', kind: 'choice', freeTextTriggers: ['Other', 'Lainnya'] },
  { id: 'service', kind: 'choice', freeTextTriggers: ['Other', 'Lainnya'] },
  { id: 'curiosity', kind: 'choice', freeTextTriggers: ['Other', 'Lainnya'] },
  { id: 'outcome', kind: 'choice', freeTextTriggers: ['Other', 'Lainnya'] },
  { id: 'timeline', kind: 'choice' },
  { id: 'budget', kind: 'choice' },
  { id: 'contact', kind: 'contact' },
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function FormPage() {
  const [lang, setLang] = useState('en');
  const [stepIndex, setStepIndex] = useState(0);
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
    phone: '',
    company_website_hp: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const t = DICT[lang];
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = Math.round(((stepIndex + (status === 'success' ? 1 : 0)) / STEPS.length) * 100);

  const update = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const getBizName = () => answers.business?.trim() || t.fallback_biz;

  const getServiceLabel = () => {
    if (answers.service === 'Other' || answers.service === 'Lainnya') {
      return answers.serviceOther?.trim() || t.fallback_svc;
    }
    return answers.service || t.fallback_svc;
  };

  const getOutcomeLabel = () => {
    if (answers.outcome === 'Other' || answers.outcome === 'Lainnya') {
      return answers.outcomeOther?.trim() || t.fallback_out;
    }
    return answers.outcome || t.fallback_out;
  };

  const isStepValid = () => {
    if (step.kind === 'business') {
      return Boolean(answers.business?.trim() && answers.handle?.trim());
    }
    if (step.kind === 'contact') {
      return Boolean(
        answers.name?.trim() &&
          answers.email?.trim() &&
          isValidEmail(answers.email.trim()) &&
          answers.phone?.trim()
      );
    }
    const val = answers[step.id];
    if (!val) return false;
    if (step.freeTextTriggers?.includes(val)) {
      return Boolean(answers[`${step.id}Other`]?.trim());
    }
    return true;
  };

  const valid = isStepValid();

  const goNext = () => {
    if (!valid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSubmit = useCallback(async () => {
    if (status === 'submitting') return;
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
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }, [answers, lang, status]);

  const handleContinue = () => {
    if (!valid) return;
    if (isLast) {
      handleSubmit();
    } else {
      goNext();
    }
  };

  if (status === 'success') {
    return (
      <main className="shell">
        <div className="card success">
          <div className="card-header">
            <p className="kicker">{t.k_success}</p>
            <div className="lang-toggle">
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
          <h1>
            {t.h_success_prefix}
            {answers.name?.split(' ')[0] || 'there'}.
          </h1>
          <p className="body-text">
            {t.s_success_prefix}
            {answers.business}
            {t.s_success_mid}
            {answers.email}
            {t.s_success_suffix}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
      {/* Spam Honeypot Field */}
      <input
        type="text"
        name="company_website_hp"
        value={answers.company_website_hp || ''}
        onChange={(e) => update('company_website_hp', e.target.value)}
        className="hp-field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Progress Track */}
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card">
        {/* Card Header with Kicker & Language Switcher */}
        <div className="card-header">
          <p className="kicker">
            {stepIndex === 0 && t.k1}
            {stepIndex === 1 && t.k2}
            {stepIndex === 2 && t.k3}
            {stepIndex === 3 && t.k4}
            {stepIndex === 4 && t.k5}
            {stepIndex === 5 && t.k6}
            {stepIndex === 6 && t.k7}
            {stepIndex === 7 && t.k8}
          </p>
          <div className="lang-toggle">
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

        {/* Step 1: Business */}
        {step.kind === 'business' && (
          <div className="fields">
            <h1 className="step-title">{t.h1}</h1>
            <p className="step-sub">{t.s1}</p>
            <label className="field">
              <span>{t.l_business}</span>
              <input
                type="text"
                value={answers.business || ''}
                onChange={(e) => update('business', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder={t.ph_business}
                autoFocus
              />
            </label>
            <label className="field">
              <span>{t.l_handle}</span>
              <input
                type="text"
                value={answers.handle || ''}
                onChange={(e) => update('handle', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder={t.ph_handle}
              />
            </label>
          </div>
        )}

        {/* Step 2: Role */}
        {step.id === 'role' && (
          <ChoiceStep
            title={
              <>
                {t.h2_prefix}
                <span className="dynamic-context">{getBizName()}</span>
                {t.h2_suffix}
              </>
            }
            options={t.options_role}
            selected={answers.role}
            onSelect={(val) => update('role', val)}
            showOther={answers.role === 'Other' || answers.role === 'Lainnya'}
            otherVal={answers.roleOther}
            onOtherChange={(val) => update('roleOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={handleContinue}
          />
        )}

        {/* Step 3: Service */}
        {step.id === 'service' && (
          <ChoiceStep
            title={
              <>
                {t.h3_prefix}
                <span className="dynamic-context">{getBizName()}</span>
                {t.h3_suffix}
              </>
            }
            options={t.options_service}
            isServicesGrid={true}
            selected={answers.service}
            onSelect={(val) => update('service', val)}
            showOther={answers.service === 'Other' || answers.service === 'Lainnya'}
            otherVal={answers.serviceOther}
            onOtherChange={(val) => update('serviceOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={handleContinue}
          />
        )}

        {/* Step 4: Curiosity */}
        {step.id === 'curiosity' && (
          <ChoiceStep
            title={
              <>
                {t.h4_prefix}
                <span className="dynamic-context">{getServiceLabel()}</span>
                {t.h4_mid}
              </>
            }
            options={t.options_curiosity}
            selected={answers.curiosity}
            onSelect={(val) => update('curiosity', val)}
            showOther={answers.curiosity === 'Other' || answers.curiosity === 'Lainnya'}
            otherVal={answers.curiosityOther}
            onOtherChange={(val) => update('curiosityOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={handleContinue}
          />
        )}

        {/* Step 5: Outcome */}
        {step.id === 'outcome' && (
          <ChoiceStep
            title={
              <>
                {t.h5_prefix}
                <span className="dynamic-context">{getServiceLabel()}</span>
                {t.h5_mid}
              </>
            }
            options={t.options_outcome}
            selected={answers.outcome}
            onSelect={(val) => update('outcome', val)}
            showOther={answers.outcome === 'Other' || answers.outcome === 'Lainnya'}
            otherVal={answers.outcomeOther}
            onOtherChange={(val) => update('outcomeOther', val)}
            otherPlaceholder={t.ph_other}
            onEnter={handleContinue}
          />
        )}

        {/* Step 6: Timeline */}
        {step.id === 'timeline' && (
          <ChoiceStep
            title={
              <>
                {t.h6_prefix}
                <span className="dynamic-context">{getOutcomeLabel()}</span>
                {t.h6_suffix}
              </>
            }
            options={t.options_timeline}
            selected={answers.timeline}
            onSelect={(val) => update('timeline', val)}
            onEnter={handleContinue}
          />
        )}

        {/* Step 7: Budget */}
        {step.id === 'budget' && (
          <ChoiceStep
            title={
              <>
                {t.h7_prefix}
                <span className="dynamic-context">{getOutcomeLabel()}</span>
                {t.h7_mid}
                <span className="dynamic-context">{getServiceLabel()}</span>
                {t.h7_suffix}
              </>
            }
            options={t.options_budget}
            selected={answers.budget}
            onSelect={(val) => update('budget', val)}
            onEnter={handleContinue}
          />
        )}

        {/* Step 8: Contact Details Form (End of Flow) */}
        {step.kind === 'contact' && (
          <div className="fields">
            <h1 className="step-title">{t.h8}</h1>
            <p className="step-sub">{t.s8}</p>
            <label className="field">
              <span>{t.l_name}</span>
              <input
                type="text"
                value={answers.name || ''}
                onChange={(e) => update('name', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder={t.ph_name}
                autoFocus
              />
            </label>
            <div className="field-row">
              <label className="field">
                <span>{t.l_email}</span>
                <input
                  type="email"
                  value={answers.email || ''}
                  onChange={(e) => update('email', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                  placeholder={t.ph_email}
                />
              </label>
              <label className="field">
                <span>{t.l_phone}</span>
                <input
                  type="tel"
                  value={answers.phone || ''}
                  onChange={(e) => update('phone', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                  placeholder={t.ph_phone}
                />
              </label>
            </div>
          </div>
        )}

        {status === 'error' && <p className="error-banner">{errorMsg}</p>}

        {/* Navigation */}
        <div className="nav">
          {stepIndex > 0 && (
            <button
              type="button"
              className="ghost"
              onClick={goBack}
              disabled={status === 'submitting'}
            >
              {t.btn_back}
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={handleContinue}
            disabled={!valid || status === 'submitting'}
          >
            {status === 'submitting' ? t.btn_submitting : isLast ? t.btn_submit : t.btn_next}
          </button>
        </div>
      </div>
    </main>
  );
}

function ChoiceStep({
  title,
  options,
  selected,
  onSelect,
  isServicesGrid = false,
  showOther = false,
  otherVal = '',
  onOtherChange,
  otherPlaceholder = 'Tell us more',
  onEnter,
}) {
  return (
    <div>
      <h1 className="step-title">{title}</h1>
      <div className={`options ${isServicesGrid ? 'services-grid' : ''}`}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`option ${selected === opt ? 'selected' : ''}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {showOther && (
        <input
          type="text"
          className="other-input"
          placeholder={otherPlaceholder}
          value={otherVal || ''}
          onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEnter && onEnter();
            }
          }}
          autoFocus
        />
      )}
    </div>
  );
}
