import { Link } from 'react-router-dom';
import { AlertTriangle, Ban, FileSignature, Scale, ShieldCheck } from 'lucide-react';
import { Card, CardBody, DemoBanner } from '@/components/ui';

const sections = [
  {
    icon: FileSignature,
    title: 'Using the service',
    body: 'You must be at least 18 and authorised to act for any business you represent. Keep your credentials secure and tell us immediately if you suspect compromise.',
  },
  {
    icon: Scale,
    title: 'Your responsibilities',
    body: 'Check payment details before confirming, keep beneficiaries verified, and report errors promptly. We are not liable for losses caused by your own delayed reporting.',
  },
  {
    icon: ShieldCheck,
    title: 'Fees and charges',
    body: 'Fees per product, rail and tier are shown in-app before you confirm, plus any third-party or correspondent-bank charges disclosed at the time.',
  },
  {
    icon: Ban,
    title: 'Suspension & closure',
    body: 'We may restrict an account to protect customers or meet legal obligations, for example on suspected fraud, sanctions matches or repeated payment errors.',
  },
  {
    icon: AlertTriangle,
    title: 'Limits of liability',
    body: 'Nothing in these terms excludes liability that cannot lawfully be excluded. Illustrative caps and exclusions shown here are examples only.',
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Terms of use</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Last updated 25 April 2025. Written for the PAYBACK prototype as an illustration of how a real terms document would be
          structured — not a binding agreement.
        </p>
      </header>

      <DemoBanner label="Prototype terms" text="Using this demo grants nothing and creates no banking relationship." />

      <section className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardBody className="space-y-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <section.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-bold text-slate-900">{section.title}</p>
              <p className="text-sm leading-relaxed text-slate-500">{section.body}</p>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card>
        <CardBody className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Demo-specific terms</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              'All balances, transactions, rates and offers are synthetic and carry no value.',
              'No banking, payment, card or investment service is provided by this prototype.',
              'Provider names appear for illustration only; most rails are labelled Demo or Not connected.',
              'You may use, screenshot and share this demo freely for evaluation and education.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center sm:p-8">
        <p className="text-sm text-slate-600">
          Questions about these terms? Use the{' '}
          <Link to="/support" className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700">
            support centre
          </Link>{' '}
          or read our{' '}
          <Link to="/privacy" className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}