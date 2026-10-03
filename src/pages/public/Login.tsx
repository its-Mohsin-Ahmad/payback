import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Alert, Button, Checkbox, OtpInput, SecurityBadge, useToast } from '@/components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('mohsin.ahmad@example.com');
  const [password, setPassword] = useState('demo-password');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStep('otp');
    }, 600);
  };

  const verify = () => {
    if (otp.length !== 6) {
      toast.error('Incomplete code', 'Enter the 6-digit code to continue.');
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      toast.success('Signed in', 'Welcome back — opening your dashboard (demo).');
      navigate('/app');
    }, 700);
  };

  return (
    <div className="mx-auto grid min-h-[80vh] w-full max-w-content items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sign in to PAYBACK</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
          One account for personal and business banking. This prototype accepts any details — use the pre-filled values.
        </p>
        <ul className="mt-6 space-y-2.5">
          {[
            'Instant internal transfers, free of charge',
            'Cards with controls you can change instantly',
            'Business payouts, payroll and approvals in one place',
          ].map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <SecurityBadge label="256-bit encrypted" />
          <SecurityBadge label="Device binding" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lift sm:p-8">
        {step === 'credentials' ? (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Account sign-in</h2>
              <p className="mt-0.5 text-sm text-slate-500">Use your email or PAYBACK ID.</p>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email or PAYBACK ID</span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-11 text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                </button>
              </span>
            </label>

            <div className="flex items-center justify-between gap-3">
              <Checkbox checked label="Keep me signed in" onChange={() => undefined} />
              <button
                type="button"
                onClick={() => toast.info('Reset link', 'A password reset link would be emailed (demo).')}
                className="focus-ring rounded-lg px-1 py-0.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" block loading={busy} iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}>
              Continue
            </Button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or continue with</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => toast.info('Demo SSO', 'Google sign-in is simulated.')}>
                Google
              </Button>
              <Button variant="outline" onClick={() => toast.info('Demo SSO', 'Apple sign-in is simulated.')}>
                Apple
              </Button>
            </div>

            <p className="text-center text-sm text-slate-500">
              New to PAYBACK?{' '}
              <Link to="/register" className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700">
                Open an account
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-5 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Verify it is you</h2>
              <p className="mt-0.5 text-sm text-slate-500">Enter the 6-digit code sent to {email}.</p>
            </div>
            <div className="flex justify-center">
              <OtpInput length={6} value={otp} onChange={setOtp} />
            </div>
            <Button block loading={busy} onClick={verify}>
              Verify &amp; sign in
            </Button>
            <p className="text-sm text-slate-500">
              Did not get a code?{' '}
              <button
                type="button"
                onClick={() => toast.info('Code resent', 'A new code was sent (demo).')}
                className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Resend
              </button>
            </p>
            <Alert tone="info" title="Demo verification">
              Any 6 digits work — tap the boxes above, then verify.
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}