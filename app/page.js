'use client';

import { useState, useCallback } from 'react';

const STEPS = [
  { id: 'profile', kind: 'profile' },
  {
    id: 'role',
    kind: 'choice',
    title: (a) => (
      <>
        What&rsquo;s your role at <span className="dynamic-context">{a.business || 'your business'}</span>?
      </>
    ),
    options: ['Owner / Founder', 'Marketing or Brand Manager', 'Other'],
    freeTextTriggers: ['Other'],
  },
  {
    id: 'service',
    kind: 'choice',
    title: (a) => (
      <>
        What are you exploring for <span className="dynamic-context">{a.business || 'your business'}</span>?
      </>
    ),
    options: [
      'Web Design & Development',
      'Branding',
      'IT Solution',
      'Digital Infrastructure',
      'E-Commerce',
      'Other',
    ],
    freeTextTriggers: ['Other'],
  },
  {
    id: 'curiosity',
    kind: 'choice',
    title: (a) => (
      <>
        When it comes to <span className="dynamic-context">{serviceLabel(a)}</span>, what&rsquo;s on your mind most right now?
      </>
    ),
    options: ["How we'd approach it", 'What it typically costs', 'What results to expect', 'Other'],
    freeTextTriggers: ['Other'],
  },
  {
    id: 'outcome',
    kind: 'choice',
    title: (a) => (
      <>
        If you moved forward with <span className="dynamic-context">{serviceLabel(a)}</span>, what outcome would make it worth it?
      </>
    ),
    options: ['More leads or inquiries', 'Stronger brand perception', 'Business scale', 'Revenue growth', 'Other'],
    freeTextTriggers: ['Other'],
  },
  {
    id: 'timeline',
    kind: 'choice',
    title: (a) => (
      <>
        When would you like to start seeing <span className="dynamic-context">{outcomeLabel(a)}</span>?
      </>
    ),
    options: ['< 3 months', '3–6 months', '6 months – 1 year', '> 1 year'],
  },
  {
    id: 'budget',
    kind: 'choice',
    title: (a) => (
      <>
        To get <span className="dynamic-context">{outcomeLabel(a)}</span> from <span className="dynamic-context">{serviceLabel(a)}</span>, what investment feels reasonable right now?
      </>
    ),
    options: ['Under IDR 20mio', 'IDR 20–50mio', 'IDR 50–100mio', 'IDR 100mio+'],
  },
];

function serviceLabel(a) {
  if (a.service === 'Other') return a.serviceOther || 'this';
  return a.service || 'this';
}

function outcomeLabel(a) {
  if (a.outcome === 'Other') return a.outcomeOther || 'that';
  return a.outcome || 'that';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStepValid(step, answers) {
  if (step.kind === 'profile') {
    return Boolean(
      answers.name?.trim() &&
        answers.email?.trim() &&
        isValidEmail(answers.email.trim()) &&
        answers.phone?.trim() &&
        answers.business?.trim() &&
        answers.handle?.trim()
    );
  }
  const value = answers[step.id];
  if (!value) return false;
  if (step.freeTextTriggers?.includes(value)) {
    return Boolean(answers[`${step.id}Other`]?.trim());
  }
  return true;
}

export default function FormPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const valid = isStepValid(step, answers);
  const progress = Math.round(((stepIndex + (status === 'success' ? 1 : 0)) / STEPS.length) * 100);

  const update = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => {
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
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  }, [answers, status]);

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
          <p className="kicker">All set</p>
          <h1>Thanks, {answers.name?.split(' ')[0] || 'there'}.</h1>
          <p className="body-text">
            We&rsquo;ve got what we need about {answers.business}. A confirmation is on its way to {answers.email},
            and we&rsquo;ll follow up shortly to lock in a time to talk.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="shell">
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

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card">
        {stepIndex === 0 && <p className="kicker">Before we get on a call</p>}

        {step.kind === 'profile' ? (
          <ProfileStep answers={answers} onChange={update} onEnter={handleContinue} />
        ) : (
          <ChoiceStep step={step} answers={answers} onSelect={update} onOtherChange={update} onEnter={handleContinue} />
        )}

        {status === 'error' && <p className="error-banner">{errorMsg}</p>}

        <div className="nav">
          {stepIndex > 0 && (
            <button type="button" className="ghost" onClick={goBack} disabled={status === 'submitting'}>
              Back
            </button>
          )}
          <button type="button" className="primary" onClick={handleContinue} disabled={!valid || status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : isLast ? 'Submit' : 'Continue'}
          </button>
        </div>
      </div>
    </main>
  );
}

function ProfileStep({ answers, onChange, onEnter }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="fields">
      <h1 className="step-title">Let&rsquo;s start with a few quick basics.</h1>
      <label className="field">
        <span>Your name</span>
        <input type="text" value={answers.name || ''} onChange={(e) => onChange('name', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Sarah" autoFocus />
      </label>
      <div className="field-row">
        <label className="field">
          <span>Email address</span>
          <input type="email" value={answers.email || ''} onChange={(e) => onChange('email', e.target.value)} onKeyDown={handleKeyDown} placeholder="you@business.com" />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input type="tel" value={answers.phone || ''} onChange={(e) => onChange('phone', e.target.value)} onKeyDown={handleKeyDown} placeholder="+62 812 3456 7890" />
        </label>
      </div>
      <label className="field">
        <span>Business name</span>
        <input type="text" value={answers.business || ''} onChange={(e) => onChange('business', e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. Kasa Villa" />
      </label>
      <label className="field">
        <span>Instagram handle or website</span>
        <input type="text" value={answers.handle || ''} onChange={(e) => onChange('handle', e.target.value)} onKeyDown={handleKeyDown} placeholder="@yourbrand or yourbrand.com" />
      </label>
    </div>
  );
}

function ChoiceStep({ step, answers, onSelect, onOtherChange, onEnter }) {
  const value = answers[step.id];
  const showOther = step.freeTextTriggers?.includes(value);

  return (
    <div>
      <h1 className="step-title">{step.title(answers)}</h1>
      <div className={`options ${step.id === 'service' ? 'services-grid' : ''}`}>
        {step.options.map((opt) => (
          <button key={opt} type="button" className={`option ${value === opt ? 'selected' : ''}`} onClick={() => onSelect(step.id, opt)}>
            {opt}
          </button>
        ))}
      </div>
      {showOther && (
        <input
          type="text"
          className="other-input"
          placeholder="Tell us more"
          value={answers[`${step.id}Other`] || ''}
          onChange={(e) => onOtherChange(`${step.id}Other`, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEnter();
            }
          }}
          autoFocus
        />
      )}
    </div>
  );
}
