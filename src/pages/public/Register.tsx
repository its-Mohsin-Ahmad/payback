import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { Alert, Button, Checkbox, Stepper, useToast } from '@/components/ui';

const ACCOUNT_TYPES = [
  { id: 'personal', title: 'Personal', body: 'Everyday banking, cards and instant transfers.', icon: User },
  { id: 'business', title: 'Business', body: 'Company accounts, payouts, payroll and approvals.', icon: Building2 },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState('personal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [company, setCompany] = useState('');
  const [busy, setBusy] = useState(false);

  const next = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1 && (!name.trim() || !email.trim())) {
      toast.error('Missing details', 'Enter your full name and email address.');
      return;
    }
    if (step === 2 && accountType === 'business' && !company.trim()) {
      toast.error('Missing details', 'Enter your registered company name.');
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      toast.success('Account created (demo)', 'Your prototype workspace is ready.');
      navigate(accountType === 'business' ? '/business/app' : '/app');
    }, 800);
  };

  return (
    <div className="mx-auto w-full max-w-content px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Join PAYBACK</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Open your account</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Three quick steps. This is a demonstration — no identity documents are requested and nothing is submitted.
          </p>
        </div>

        <div className="mt-8">
          <Stepper steps={[{ label: 'Account type' }, { label: 'Your details' }, { label: 'Verify' }]} current={step} />
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lift sm:p-8">
          {step === 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Who is this account for?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {ACCOUNT_TYPES.map((type) => {
                  const active = accountType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAccountType(type.id)}
                      className={`focus-ring rounded-2xl border p-4 text-left transition-colors ${
                        active ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <type.icon className="h-5 w-5" aria-hidden />
                        </span>
                        {active ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden /> : null}
                      </div>
                      <p className="mt-3 text-sm font-bold text-slate-900">{type.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{type.body}</p>
                    </button>
                  );
                })}
              </div>
              <Alert tone="warning" title="Demo registration">
                Nothing is submitted to a server and no KYC checks are performed.
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              {step === 1 ? (
                <>
                  <h2 className="text-lg font-bold text-slate-900">Your details</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mohsin Ahmad"
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Mobile number</span>
                      <input
                        placeholder="+92 300 000 0000"
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">CNIC / National ID</span>
                      <input
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder="00000-0000000-0"
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-400">All fields are optional in the prototype.</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-900">Almost there</h2>
                  {accountType === 'business' ? (
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Registered company name</span>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Northwind Technologies (Pvt) Ltd"
                        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                      />
                    </label>
                  ) : (
                    <p className="text-sm text-slate-500">
                      We will set up your current account with a free debit card and instant internal transfers.
                    </p>
                  )}
                  <div className="flex items-start gap-2.5">
                    <Checkbox checked label="I agree to the Terms of Use and Privacy Policy" onChange={() => undefined} />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-xs text-emerald-800">
                    <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
                    Identity verification is simulated. No documents are uploaded or stored.
                  </div>
                </>
              )}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Back
                </Button>
                <Button loading={busy} onClick={next} iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
                  {step === 2 ? 'Create account' : 'Continue'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}