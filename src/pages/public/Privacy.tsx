import { Link } from 'react-router-dom';
import { Cookie, Database, Eye, Lock, Share2, Trash2, UserCheck } from 'lucide-react';
import { Card, CardBody, DemoBanner } from '@/components/ui';

const sections = [
  {
    icon: Database,
    title: 'What we collect',
    body: 'Account details, identity information for KYC, transaction records, device and session data, and support conversations. In this prototype every value is synthetic.',
  },
  {
    icon: Lock,
    title: 'How we protect it',
    body: 'Encryption in transit and at rest, strict access control, least-privilege internal tooling, and immutable logging of privileged actions.',
  },
  {
    icon: Share2,
    title: 'When we share it',
    body: 'Only with payment rails you explicitly instruct, regulators where legally required, and vetted service providers under contract. Never sold to advertisers.',
  },
  {
    icon: Eye,
    title: 'Your choices',
    body: 'Control marketing messages, biometrics and alert channels in-app; export or delete personal data from Settings or by contacting support.',
  },
  {
    icon: Cookie,
    title: 'Cookies & analytics',
    body: 'Strictly necessary cookies keep you signed in; optional analytics help us improve the product and can be declined.',
  },
  {
    icon: Trash2,
    title: 'Retention',
    body: 'Records are kept for the legally required period (commonly seven years for financial records) and then securely deleted.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Privacy policy</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Last updated 25 April 2025. This is an illustrative policy written for the PAYBACK prototype — it is not a legally
          binding document and does not describe a real processing environment.
        </p>
      </header>

      <DemoBanner label="Prototype policy" text="No personal data is collected by this demo. Nothing you type is transmitted or stored." />

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
          <div className="flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-emerald-600" aria-hidden />
            <h2 className="text-base font-bold text-slate-900">Your rights</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {[
              'Ask what personal data we hold about you and request a copy.',
              'Ask us to correct anything inaccurate or incomplete.',
              'Withdraw consent for optional processing at any time.',
              'Request deletion where no legal retention obligation applies.',
            ].map((right) => (
              <li key={right} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                {right}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center sm:p-8">
        <p className="text-sm text-slate-600">
          Questions about privacy? Email <span className="font-semibold text-slate-900">privacy@payback.example</span> or use the{' '}
          <Link to="/support" className="focus-ring rounded font-semibold text-emerald-600 hover:text-emerald-700">
            support centre
          </Link>
          .
        </p>
      </div>
    </div>
  );
}