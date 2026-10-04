import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  CreditCard,
  Eye,
  Fingerprint,
  IdCard,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Input,
  OtpInput,
  ProgressBar,
  SegmentedControl,
  Select,
  SecurityBadge,
  useToast,
} from '@/components/ui';
import { LoaderBar, LoaderStages, PageLoader, type LoaderStage } from '@/components/loaders';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Journey model                                                       */
/* ------------------------------------------------------------------ */

const STEPS = [
  { key: 'personal', n: '01', label: 'Personal' },
  { key: 'contact', n: '02', label: 'Contact' },
  { key: 'account', n: '03', label: 'Account' },
  { key: 'identity', n: '04', label: 'Identity' },
  { key: 'face', n: '05', label: 'Verification' },
  { key: 'security', n: '06', label: 'Security' },
  { key: 'review', n: '07', label: 'Review' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

type AccountType = 'personal' | 'premium' | 'business';

interface Onboarding {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  nationality: string;
  residence: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  accountType: AccountType;
  document: string;
  documentNumber: string;
  twoFactor: 'authenticator' | 'sms' | 'email';
  recoveryEmail: string;
  biometrics: boolean;
}

const EMPTY: Onboarding = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  nationality: 'Pakistani',
  residence: 'Pakistan',
  mobile: '+92 300 123 4567',
  email: '',
  address: '',
  city: 'Lahore',
  country: 'Pakistan',
  postal: '',
  accountType: 'personal',
  document: 'CNIC — National Identity Card',
  documentNumber: '',
  twoFactor: 'authenticator',
  recoveryEmail: '',
  biometrics: false,
};

const ACCOUNT_OPTIONS = [
  {
    id: 'personal' as const,
    title: 'Personal Account',
    icon: Wallet,
    perks: ['No monthly fee', 'Free debit card', 'Instant PAYBACK transfers'],
  },
  {
    id: 'premium' as const,
    title: 'Premium Account',
    icon: CreditCard,
    perks: ['Premium metal card', 'Higher limits', 'Priority support'],
  },
  {
    id: 'business' as const,
    title: 'Business Account',
    icon: Building2,
    perks: ['Payroll & payouts', 'Maker-checker approvals', 'Accounting integrations'],
  },
];

const DOCUMENTS = ['CNIC — National Identity Card', 'Passport', 'Driving Licence'];

/** Strength rules for the account password. */
function passwordScore(value: string) {
  const checks = [
    value.length >= 12,
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  return { passed: checks.filter(Boolean).length, total: checks.length, strong: checks.every(Boolean) };
}

const STEP_HEADINGS: Record<StepKey, string> = {
  personal: 'Tell us about you',
  contact: 'How can we reach you?',
  account: 'Choose your account',
  identity: 'Verify your identity',
  face: 'Verify it is really you',
  security: 'Secure your account',
  review: 'Review your application',
};

const STEP_SUBHEADINGS: Record<StepKey, string> = {
  personal: 'A smarter way to manage your money.',
  contact: 'We use these details for statements and security alerts.',
  account: 'You can change your account type later.',
  identity: 'A quick identity check keeps your account safe.',
  face: 'Use your camera to complete identity verification.',
  security: 'Set up protection you will not have to think about.',
  review: 'Check everything before we create your account.',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [index, setIndex] = useState(0);
  const [data, setData] = useState<Onboarding>(EMPTY);
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [contactOtp, setContactOtp] = useState('');
  const [contactVerified, setContactVerified] = useState(false);
  const [docStage, setDocStage] = useState<'choose' | 'scan' | 'reading' | 'review'>('choose');
  const [faceStage, setFaceStage] = useState<'intro' | 'liveness' | 'done'>('intro');
  const [creating, setCreating] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [recoveryShown, setRecoveryShown] = useState(false);

  const step = STEPS[index];
  const patch = (next: Partial<Onboarding>) => setData((d) => ({ ...d, ...next }));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  const recoveryCodes = useMemo(
    () => Array.from({ length: 6 }, () => Math.random().toString(36).slice(2, 8).toUpperCase()),
    []
  );

  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');

  const validate = (): string | null => {
    if (step.key === 'personal' && (!data.firstName.trim() || !data.lastName.trim() || !data.dob)) {
      return 'Enter your first name, last name and date of birth.';
    }
    if (step.key === 'contact') {
      if (!data.email.includes('@')) return 'Enter a valid email address.';
      if (!contactVerified) return 'Verify your email with the 6-digit code first.';
    }
    if (step.key === 'identity' && docStage !== 'review') return 'Scan and review your document to continue.';
    if (step.key === 'face' && faceStage !== 'done') return 'Complete the simulated verification to continue.';
    if (step.key === 'security') {
      if (!passwordScore(password).strong) return 'Your password does not meet all five requirements yet.';
      if (pin.length !== 4) return 'Choose a 4-digit transaction PIN.';
    }
    return null;
  };

  const goNext = () => {
    const problem = validate();
    if (problem) {
      toast.error('Almost there', problem);
      return;
    }
    if (step.key === 'review') {
      setCreating(true);
      setCreateStep(0);
      return;
    }
    setIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  if (complete) {
    return (
      <SuccessScreen
        name={fullName}
        type={data.accountType}
        onDashboard={() => navigate('/app')}
        onExplore={() => navigate('/app/cards')}
      />
    );
  }

  if (creating) return <CreatingScreen onDone={() => setComplete(true)} />;

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          {index > 0 ? (
            <button type="button" onClick={goBack} aria-label="Previous step" className="focus-ring rounded-xl p-2 text-slate-500 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900">Open Your PAYBACK Account</p>
            <p className="text-xs text-slate-500">
              Step {step.n} of 07 • {step.label}
            </p>
          </div>
          <SecurityBadge label="Encrypted" />
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3 sm:px-6">
          <ProgressBar value={index + 1} max={STEPS.length} label="Onboarding progress" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="animate-rise space-y-5">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{STEP_HEADINGS[step.key]}</h1>
              <p className="mt-2 text-sm text-slate-500">{STEP_SUBHEADINGS[step.key]}</p>
            </div>

            {step.key === 'personal' && <PersonalStep data={data} patch={patch} />}
            {step.key === 'contact' && (
              <ContactStep
                data={data}
                patch={patch}
                otp={contactOtp}
                setOtp={setContactOtp}
                verified={contactVerified}
                onVerify={() => {
                  if (contactOtp.length !== 6) {
                    toast.error('Code incomplete', 'Enter the 6-digit code we sent to your email.');
                    return;
                  }
                  setContactVerified(true);
                  toast.success('Email verified', 'You can continue to the next step.');
                }}
              />
            )}
            {step.key === 'account' && <AccountStep data={data} patch={patch} />}
            {step.key === 'identity' && <IdentityStep data={data} patch={patch} stage={docStage} setStage={setDocStage} />}
            {step.key === 'face' && <FaceStep stage={faceStage} setStage={setFaceStage} />}
            {step.key === 'security' && (
              <SecurityStep
                password={password}
                setPassword={setPassword}
                pin={pin}
                setPin={setPin}
                data={data}
                patch={patch}
                recoveryCodes={recoveryCodes}
                recoveryShown={recoveryShown}
                setRecoveryShown={setRecoveryShown}
              />
            )}
            {step.key === 'review' && (
              <ReviewStep data={data} password={password} onEdit={(key) => setIndex(STEPS.findIndex((s) => s.key === key))} />
            )}

            {/* Sticky continue on mobile */}
            <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:backdrop-blur-none">
              <Button block iconRight={<ArrowRight className="h-4 w-4" aria-hidden />} onClick={goNext}>
                {step.key === 'review' ? 'Create my account' : 'Continue'}
              </Button>
            </div>
          </div>

          <aside className="hidden space-y-3 lg:block">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-sm font-bold text-slate-900">Your journey</p>
              <ol className="mt-3 space-y-2.5">
                {STEPS.map((s, i) => (
                  <li key={s.key} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold',
                        i < index ? 'bg-emerald-500 text-white' : i === index ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {i < index ? '✓' : s.n}
                    </span>
                    <span className={i <= index ? 'font-semibold text-slate-800' : 'text-slate-400'}>{s.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden />
                Why we ask
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Identity checks are required by regulation and protect you from fraud. We only collect what we need, and never
                share it with third parties.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
        Prototype only — no real account is opened and no identity document is transmitted. Questions?{' '}
        <Link to="/support" className="font-semibold text-emerald-600 hover:text-emerald-700">
          Contact support
        </Link>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 01 — Personal information                                      */
/* ------------------------------------------------------------------ */

function PersonalStep({ data, patch }: { data: Onboarding; patch: (next: Partial<Onboarding>) => void }) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="First name *" required value={data.firstName} onChange={(e) => patch({ firstName: e.target.value })} placeholder="Mohsin" />
        <Input label="Middle name" value={data.middleName} onChange={(e) => patch({ middleName: e.target.value })} placeholder="Optional" />
        <Input label="Last name *" required value={data.lastName} onChange={(e) => patch({ lastName: e.target.value })} placeholder="Ahmad" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Date of birth *" required type="date" value={data.dob} onChange={(e) => patch({ dob: e.target.value })} />
        <Select
          label="Nationality"
          value={data.nationality}
          onChange={(e) => patch({ nationality: e.target.value })}
          options={[
            { value: 'Pakistani', label: 'Pakistani' },
            { value: 'British', label: 'British' },
            { value: 'Emirati', label: 'Emirati' },
            { value: 'Saudi', label: 'Saudi' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <Select
          label="Country of residence"
          value={data.residence}
          onChange={(e) => patch({ residence: e.target.value })}
          options={[
            { value: 'Pakistan', label: 'Pakistan' },
            { value: 'United Kingdom', label: 'United Kingdom' },
            { value: 'United Arab Emirates', label: 'United Arab Emirates' },
            { value: 'Saudi Arabia', label: 'Saudi Arabia' },
          ]}
        />
      </div>

      <p className="flex items-start gap-2 text-xs text-slate-400">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        We collect only what the account requires. Fields marked * are mandatory.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 02 — Contact information + email verification                 */
/* ------------------------------------------------------------------ */

function ContactStep({
  data,
  patch,
  otp,
  setOtp,
  verified,
  onVerify,
}: {
  data: Onboarding;
  patch: (next: Partial<Onboarding>) => void;
  otp: string;
  setOtp: (v: string) => void;
  verified: boolean;
  onVerify: () => void;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Mobile number *" required value={data.mobile} onChange={(e) => patch({ mobile: e.target.value })} />
        <Input
          label="Email address *"
          required
          type="email"
          value={data.email}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder="you@example.com"
          rightSlot={verified ? <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden /> : undefined}
          hint={verified ? 'Verified' : 'We will send a 6-digit code here'}
        />
      </div>

      <Input label="Residential address" value={data.address} onChange={(e) => patch({ address: e.target.value })} placeholder="House, street, area" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="City" value={data.city} onChange={(e) => patch({ city: e.target.value })} />
        <Select
          label="Country"
          value={data.country}
          onChange={(e) => patch({ country: e.target.value })}
          options={[
            { value: 'Pakistan', label: 'Pakistan' },
            { value: 'United Kingdom', label: 'United Kingdom' },
            { value: 'United Arab Emirates', label: 'United Arab Emirates' },
          ]}
        />
        <Input label="Postal code" value={data.postal} onChange={(e) => patch({ postal: e.target.value })} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Mail className="h-4 w-4 text-slate-500" aria-hidden />
          {verified ? 'Email verified' : 'Verify your email'}
        </p>
        {verified ? (
          <Alert tone="success" title="Address confirmed">
            We sent a verification code to {data.email || 'your email address'}.
          </Alert>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex justify-center">
              <OtpInput length={6} value={otp} onChange={setOtp} />
            </div>
            <Button block variant="soft" onClick={onVerify}>
              Verify email
            </Button>
            <p className="text-center text-[11px] text-slate-400">Any 6 digits work in this prototype.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 03 — Account type                                              */
/* ------------------------------------------------------------------ */

function AccountStep({ data, patch }: { data: Onboarding; patch: (next: Partial<Onboarding>) => void }) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      {ACCOUNT_OPTIONS.map((option) => {
        const active = data.accountType === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => patch({ accountType: option.id })}
            className={cn(
              'focus-ring flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors',
              active ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500')}>
              <option.icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">{option.title}</span>
                {active ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> : null}
              </span>
              <span className="mt-1.5 flex flex-wrap gap-1.5">
                {option.perks.map((perk) => (
                  <span key={perk} className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                    {perk}
                  </span>
                ))}
              </span>
            </span>
          </button>
        );
      })}
      {data.accountType === 'business' ? (
        <Alert tone="info" title="Business accounts">
          After opening, you will add company registration details and invite your team members with maker-checker roles.
        </Alert>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 04 — Identity verification (document scan + OCR concept)       */
/* ------------------------------------------------------------------ */

function IdentityStep({
  data,
  patch,
  stage,
  setStage,
}: {
  data: Onboarding;
  patch: (next: Partial<Onboarding>) => void;
  stage: 'choose' | 'scan' | 'reading' | 'review';
  setStage: (s: 'choose' | 'scan' | 'reading' | 'review') => void;
}) {
  const [glare, setGlare] = useState(false);
  const [blur, setBlur] = useState(false);

  const capture = () => {
    if (glare || blur) return;
    setStage('reading');
    window.setTimeout(() => {
      patch({ documentNumber: '35202-1188394-7' });
      setStage('review');
    }, 1500);
  };

  if (stage === 'choose') {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <p className="text-sm text-slate-500">Choose one document. Make sure all four corners are visible and not expired.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {DOCUMENTS.map((doc) => (
            <button
              key={doc}
              type="button"
              onClick={() => {
                patch({ document: doc });
                setStage('scan');
              }}
              className={cn(
                'focus-ring flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors',
                data.document === doc ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-200 hover:border-slate-300'
              )}
            >
              <IdCard className="h-6 w-6 text-slate-500" aria-hidden />
              <span className="text-sm font-semibold text-slate-800">{doc.split(' — ')[0]}</span>
              <span className="text-[11px] text-slate-500">{doc.split(' — ')[1]}</span>
            </button>
          ))}
        </div>
        <Alert tone="warning" title="Prototype verification">
          No document is uploaded or stored. Capture and extraction below are simulated to demonstrate the intended flow.
        </Alert>
      </div>
    );
  }

  if (stage === 'scan') {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-navy">
          <div className="hero-grid absolute inset-0 opacity-25" aria-hidden />
          <div className="animate-pulse-ring absolute h-52 w-80 rounded-3xl border-2 border-emerald-400/70" aria-hidden />

          <div className="relative h-44 w-72 rounded-2xl border-2 border-dashed border-emerald-400/80">
            <div className="absolute inset-4 rounded-lg border border-emerald-400/40" aria-hidden />
            <p className="absolute inset-x-0 -top-9 text-center text-sm font-semibold text-white">Place your ID inside the frame</p>
          </div>

          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            <Badge tone={glare ? 'amber' : 'emerald'}>{glare ? 'Glare detected' : 'Lighting OK'}</Badge>
            <Badge tone={blur ? 'amber' : 'emerald'}>{blur ? 'Too blurry' : 'Sharp'}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={glare ? 'soft' : 'outline'} size="sm" onClick={() => setGlare((g) => !g)}>
            Simulate glare
          </Button>
          <Button variant={blur ? 'soft' : 'outline'} size="sm" onClick={() => setBlur((b) => !b)}>
            Simulate blur
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button block disabled={glare || blur} icon={<Camera className="h-4 w-4" aria-hidden />} onClick={capture}>
            Capture document
          </Button>
          <Button block variant="ghost" onClick={() => setStage('choose')}>
            Change document
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'reading') {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white shadow-card">
        <PageLoader
          message="Reading your document"
          detail="Extracting name, date of birth, document number and expiry."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <Alert tone="success" title="Document read">
        Please confirm the details below match your document. Nothing has been stored.
      </Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" value={`${data.firstName} ${data.lastName}`.trim() || 'Mohsin Ahmad'} onChange={() => undefined} />
        <Input label="Date of birth" value={data.dob || '1991-08-14'} onChange={() => undefined} />
        <Input label="Document number" value={data.documentNumber || '35202-1188394-7'} onChange={() => undefined} />
        <Input label="Expiry date" value="2029-04-30" onChange={() => undefined} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" block onClick={() => setStage('scan')}>
          Retake
        </Button>
        <Button block icon={<BadgeCheck className="h-4 w-4" aria-hidden />} onClick={() => undefined}>
          Confirm details
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 05 — Face verification (explicitly simulated) + liveness      */
/* ------------------------------------------------------------------ */

function FaceStep({ stage, setStage }: { stage: 'intro' | 'liveness' | 'done'; setStage: (s: 'intro' | 'liveness' | 'done') => void }) {
  useEffect(() => {
    if (stage !== 'liveness') return;
    const id = window.setTimeout(() => setStage('done'), 2200);
    return () => window.clearTimeout(id);
  }, [stage, setStage]);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">{stage === 'done' ? 'Identity verified' : 'Verify Your Identity'}</p>
        <Badge tone="amber" icon={<Sparkles className="h-3 w-3" aria-hidden />}>
          Simulated verification
        </Badge>
      </div>

      <div className="relative mx-auto flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-navy">
        <div className="hero-grid absolute inset-0 opacity-25" aria-hidden />
        <div className="animate-pulse-ring absolute h-48 w-48 rounded-full border-2 border-emerald-400/70" aria-hidden />
        {stage === 'done' ? (
          <CheckCircle2 className="h-14 w-14 text-emerald-400" aria-hidden />
        ) : (
          <>
            <Camera className="h-12 w-12 text-white/30" aria-hidden />
            {stage === 'liveness' ? (
              <div className="absolute inset-x-0 bottom-6 text-center">
                <p className="text-sm font-semibold text-white">Look straight ahead…</p>
                <p className="mt-0.5 text-[11px] text-white/60">Blink once when prompted</p>
              </div>
            ) : null}
          </>
        )}
      </div>

      <ul className="space-y-2 text-sm text-slate-600">
        {['Look at the camera', 'Keep your face centred', 'Remove sunglasses, hats or masks', 'Use a well-lit, plain background'].map(
          (tip) => (
            <li key={tip} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
              {tip}
            </li>
          )
        )}
      </ul>

      {stage === 'intro' ? (
        <Button block icon={<Camera className="h-4 w-4" aria-hidden />} onClick={() => setStage('liveness')}>
          Start verification
        </Button>
      ) : null}

      {stage === 'done' ? <BiometricConsent /> : null}

      <Alert tone="warning" title="This is not real biometrics">
        PAYBACK does not capture, store or transmit face images or biometric templates. This screen demonstrates the flow only.
      </Alert>
    </div>
  );
}

function BiometricConsent() {
  const toast = useToast();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const supported = typeof window !== 'undefined' && 'PublicKeyCredential' in window;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
        <Fingerprint className="h-4 w-4" aria-hidden />
        Enable Biometric Login?
      </p>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-emerald-900/80">
        <li>• Signs you in and approves payments using your device secure enclave.</li>
        <li>• Your fingerprint or face template never reaches PAYBACK servers.</li>
        <li>• Disable it any time in Security Centre → Biometric sign-in.</li>
        <li>• If it fails three times, we fall back to your password.</li>
      </ul>
      <p className="mt-2 text-[11px] text-emerald-900/70">
        {supported ? 'This device supports platform biometrics (WebAuthn).' : 'This device has no platform biometric API.'}
      </p>
      {enabled === null ? (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            onClick={() => {
              setEnabled(true);
              toast.success('Biometric login enabled', 'Uses your device secure enclave (simulated).');
            }}
          >
            Enable
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEnabled(false)}>
            Not now
          </Button>
        </div>
      ) : (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          {enabled ? 'Biometric login enabled for this device.' : 'Biometric login skipped — you can enable it later.'}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 06 — Security setup                                            */
/* ------------------------------------------------------------------ */

function SecurityStep({
  password,
  setPassword,
  pin,
  setPin,
  data,
  patch,
  recoveryCodes,
  recoveryShown,
  setRecoveryShown,
}: {
  password: string;
  setPassword: (v: string) => void;
  pin: string;
  setPin: (v: string) => void;
  data: Onboarding;
  patch: (next: Partial<Onboarding>) => void;
  recoveryCodes: string[];
  recoveryShown: boolean;
  setRecoveryShown: (v: boolean) => void;
}) {
  const toast = useToast();
  const score = passwordScore(password);
  const rules = [
    { label: 'At least 12 characters', ok: password.length >= 12 },
    { label: 'A lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'An uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'A number', ok: /\d/.test(password) },
    { label: 'A symbol', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      {/* Password */}
      <div>
        <Input
          label="Password"
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          leftIcon={<Lock className="h-4 w-4" aria-hidden />}
        />
        <ProgressBar value={score.passed} max={score.total} tone={score.strong ? '#10B981' : '#F59E0B'} className="mt-2" label="Password strength" />
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {rules.map((rule) => (
            <li key={rule.label} className={cn('flex items-center gap-1.5 text-xs', rule.ok ? 'text-emerald-600' : 'text-slate-400')}>
              {rule.ok ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <span className="h-3.5 w-3.5 rounded-full border border-slate-300" aria-hidden />}
              {rule.label}
            </li>
          ))}
        </ul>
      </div>

      {/* PIN */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">Transaction PIN</p>
        {/* Interactive 4-digit PIN — tap a box or type straight away. */}
        <OtpInput
          length={4}
          value={pin}
          onChange={(next) => setPin(next.replace(/\D/g, '').slice(0, 4))}
        />
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          {pin.length === 4 ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
              PIN set — you can change it later in Settings.
            </>
          ) : (
            'Used for in-app approvals. Four digits, never shown again after setup.'
          )}
        </p>
      </div>

      {/* 2FA */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700">Two-factor authentication</p>
        <SegmentedControl
          value={data.twoFactor}
          onChange={(v) => patch({ twoFactor: v })}
          options={[
            { value: 'authenticator', label: 'Authenticator' },
            { value: 'sms', label: 'SMS' },
            { value: 'email', label: 'Email' },
          ]}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          {data.twoFactor === 'authenticator'
            ? 'Recommended: time-based codes from an authenticator app.'
            : data.twoFactor === 'sms'
              ? 'Codes sent to +92 300 ••• 4567.'
              : 'Codes sent to your verified email address.'}
        </p>
      </div>

      {/* Recovery */}
      <Input
        label="Recovery email"
        type="email"
        value={data.recoveryEmail}
        onChange={(e) => patch({ recoveryEmail: e.target.value })}
        placeholder="backup@example.com"
        hint="Used only if you lose access. Never shown on the sign-in screen."
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="text-sm font-semibold text-slate-800">Recovery codes</p>
        <p className="mt-1 text-xs text-slate-500">
          Six single-use codes for when you cannot access your phone. They are shown once and never stored in plain text.
        </p>
        {!recoveryShown ? (
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            icon={<Eye className="h-4 w-4" aria-hidden />}
            onClick={() => {
              setRecoveryShown(true);
              toast.info('Shown once', 'Save these codes somewhere safe — they cannot be displayed again.');
            }}
          >
            Show recovery codes
          </Button>
        ) : (
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code) => (
                <code key={code} className="rounded-lg bg-white px-2.5 py-1.5 text-center font-mono text-[13px] font-semibold text-slate-800 ring-1 ring-inset ring-slate-200">
                  {code}
                </code>
              ))}
            </div>
            <Button size="sm" variant="ghost" onClick={() => setRecoveryShown(false)}>
              Hide codes
            </Button>
          </div>
        )}
      </div>

      <Alert tone="info" title="We never store these secrets in plain text">
        Passwords, PINs and recovery codes would be hashed or encrypted in a real deployment — and would never be logged.
      </Alert>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 07 — Review + consent                                          */
/* ------------------------------------------------------------------ */

function ReviewStep({
  data,
  password,
  onEdit,
}: {
  data: Onboarding;
  password: string;
  onEdit: (key: StepKey) => void;
}) {
  const [consent, setConsent] = useState(false);
  const name = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ') || 'Your name';
  const accountLabel = ACCOUNT_OPTIONS.find((a) => a.id === data.accountType)?.title ?? 'Personal Account';

  const sections: { key: StepKey; title: string; rows: [string, string][] }[] = [
    {
      key: 'personal',
      title: 'Personal information',
      rows: [
        ['Full name', name],
        ['Date of birth', data.dob || '—'],
        ['Nationality', data.nationality],
        ['Country of residence', data.residence],
      ],
    },
    {
      key: 'contact',
      title: 'Contact information',
      rows: [
        ['Mobile', data.mobile],
        ['Email', data.email || '—'],
        ['Address', [data.address, data.city, data.postal].filter(Boolean).join(', ') || '—'],
        ['Country', data.country],
      ],
    },
    {
      key: 'identity',
      title: 'Identity',
      rows: [
        ['Document', data.document],
        ['Document number', data.documentNumber || '35202-1188394-7'],
        ['Face check', 'Simulated verification completed'],
      ],
    },
    {
      key: 'account',
      title: 'Account type',
      rows: [
        ['Product', accountLabel],
        ['Monthly fee', data.accountType === 'premium' ? 'None while in trial (demo)' : 'None'],
      ],
    },
    {
      key: 'security',
      title: 'Security',
      rows: [
        ['Password', passwordScore(password).strong ? 'Strong — all requirements met' : 'Not set'],
        ['Transaction PIN', '4 digits configured'],
        ['Two-factor', data.twoFactor === 'authenticator' ? 'Authenticator app' : data.twoFactor === 'sms' ? 'SMS' : 'Email'],
        ['Recovery', data.recoveryEmail || 'Recovery codes generated'],
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">{section.title}</h2>
            <Button size="xs" variant="ghost" onClick={() => onEdit(section.key)}>
              Edit
            </Button>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {section.rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="text-sm font-semibold text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-sm font-bold text-slate-900">Consents</h2>
        <div className="mt-3">
          <Checkbox
            checked={consent}
            onChange={setConsent}
            label="I agree to the Terms of Use, Privacy Policy and electronic communications."
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          You can withdraw consent later in Settings. We never sell your data or share it for advertising.
        </p>
        {consent ? (
          <Alert tone="success" title="Ready to create your account">
            Everything looks good — continue below.
          </Alert>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Account creation + success                                          */
/* ------------------------------------------------------------------ */

const CREATE_STEPS = ['Validating information', 'Verifying identity', 'Setting up account', 'Activating security', 'Preparing dashboard'];

function CreatingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  /** Map the numeric step onto the shared stage model. */
  const stages = useMemo(
    () =>
      CREATE_STEPS.map((label, i): LoaderStage => ({
        label,
        status: i < step ? 'complete' : i === step ? 'active' : 'pending',
      })),
    [step],
  );

  useEffect(() => {
    if (step >= CREATE_STEPS.length - 1) {
      const done = window.setTimeout(onDone, 700);
      return () => window.clearTimeout(done);
    }
    const next = window.setTimeout(() => setStep((s) => s + 1), 900);
    return () => window.clearTimeout(next);
  }, [step, onDone]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lift">
        {/*
          The stage rail replaces a hand-rolled list of numbered circles. It is
          the honest progress model here: we genuinely know which step we are on,
          so we show the steps rather than inventing a percentage.
        */}
        <LoaderStages stages={stages} className="mx-auto mt-2 w-full max-w-xs" />

        <h1 className="mt-6 text-xl font-bold text-slate-900">Creating Your PAYBACK Account</h1>
        <p className="mt-1 text-sm text-slate-500">Please keep this screen open — it takes a few seconds.</p>

        <LoaderBar progress={null} className="mt-6" />
      </div>
    </div>
  );
}

function SuccessScreen({
  name,
  type,
  onDashboard,
  onExplore,
}: {
  name: string;
  type: AccountType;
  onDashboard: () => void;
  onExplore: () => void;
}) {
  const accountLabel = ACCOUNT_OPTIONS.find((a) => a.id === type)?.title ?? 'Personal Account';
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lift">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Welcome to PAYBACK</h1>
        <p className="mt-1.5 text-sm text-slate-500">Your account setup is complete.</p>

        <dl className="mt-6 space-y-2 rounded-2xl bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-semibold text-slate-900">{name || 'New customer'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Account type</dt>
            <dd className="font-semibold text-slate-900">{accountLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Account number</dt>
            <dd className="tnum font-mono text-[13px] font-semibold text-slate-900">•••• 4821</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Security</dt>
            <dd>
              <Badge tone="emerald" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>
                Protected
              </Badge>
            </dd>
          </div>
        </dl>

        <div className="mt-6 space-y-2">
          <Button block onClick={onDashboard} iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
            Go to Dashboard
          </Button>
          <Button block variant="outline" onClick={onExplore} icon={<CreditCard className="h-4 w-4" aria-hidden />}>
            Explore Your Account
          </Button>
        </div>

        <p className="mt-5 text-xs text-slate-400">Prototype only — no real account, card or payment rail was created.</p>
      </div>
    </div>
  );
}