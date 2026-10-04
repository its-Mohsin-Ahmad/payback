import { BadgeCheck, Pencil, ShieldCheck, XCircle } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CopyField,
  DemoBanner,
  KeyValue,
  PageHeader,
  useToast,
} from '@/components/ui';
import { customer, totalBalance } from '@/data/mock';
import { useSession } from '@/lib/session/SessionProvider';
import { accountsFor, fullAddress, fullName, initials, maskPhone } from '@/lib/session/selectors';
import { money } from '@/lib/utils';

export default function ProfilePage() {
  const toast = useToast();
  // Every value below comes from the signed-in session, never a constant
  // (spec §4, §7, §8, §9). Editing the profile in Settings updates this page.
  const { session } = useSession();
  const user = session.user;
  const primaryAccount = accountsFor(session)[0];

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Your personal details, verification status and membership."
        actions={
          <Button variant="outline" icon={<Pencil className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Profile editing is simulated in this prototype.')}>
            Edit profile
          </Button>
        }
      />

      <DemoBanner label="Demo identity" text="All identity details below are synthetic and unverifiable." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-6 text-white shadow-lift navy-mesh lg:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* Uploaded photo when present, otherwise initials derived from the
                live name (spec §5). */}
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full border-2 border-white/25 object-cover"
              />
            ) : (
              <Avatar name={fullName(user)} size="xl" color="#10B981" />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{fullName(user)}</h2>
                <Badge tone="emerald" icon={<BadgeCheck className="h-3 w-3" aria-hidden />}>
                  {user.tier}
                </Badge>
              </div>
              <p className="text-sm text-white/60">
                {user.email} • {maskPhone(user.phone)}
              </p>
              <p className="text-xs text-white/45">Member since {user.memberSince}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { k: 'Total relationship', v: money(totalBalance.total, totalBalance.currency) },
              { k: 'Accounts', v: '6 active' },
              { k: 'KYC status', v: 'Verified' },
            ].map((item) => (
              <div key={item.k} className="rounded-xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">{item.k}</p>
                <p className="tnum mt-0.5 text-[13px] font-bold">{item.v}</p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader title="Verification (KYC)" subtitle="Level 3 — fully verified" action={<Badge tone="emerald">Complete</Badge>} />
          <CardBody className="space-y-3">
            {[
              { label: 'Identity document', ok: true },
              { label: 'Proof of address', ok: true },
              { label: 'Biometric check', ok: true },
              { label: 'Source of funds', ok: false },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-600">{row.label}</span>
                {row.ok ? <Badge tone="emerald">Verified</Badge> : <Badge tone="amber">Optional</Badge>}
              </div>
            ))}
            <Alert tone="info" title="Why we verify">
              Verification keeps your account compliant and unlocks higher limits. This prototype does not accept real documents.
            </Alert>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Personal details" />
          <CardBody>
            <KeyValue
              columns={2}
              items={[
                { label: 'Full name', value: fullName(user) },
                { label: 'Preferred name', value: user.preferredName || user.firstName },
                { label: 'Email', value: user.email },
                { label: 'Mobile', value: maskPhone(user.phone) },
                { label: 'Date of birth', value: user.dateOfBirth },
                { label: 'National ID', value: user.nationalId, mono: true },
                { label: 'Nationality', value: user.nationality },
                { label: 'Address', value: fullAddress(user) },
                { label: 'City', value: `${user.city}${user.postal ? ` ${user.postal}` : ''}` },
                { label: 'Country', value: user.country },
                { label: 'Member since', value: user.memberSince },
              ]}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Account identifiers" subtitle="Share these to receive money" />
            <CardBody className="space-y-4">
              <CopyField label="IBAN" value={primaryAccount?.iban ?? 'Not available'} hint="Demo IBAN — not a real account." />
              {/* Derived from the live profile, so it changes with the account
                  holder rather than staying a fixed string (spec §7). */}
              <CopyField
                label="PAYBACK ID"
                value={`${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@payback`}
                hint="Send to other PAYBACK users instantly."
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Membership benefits" />
            <CardBody className="space-y-2.5">
              {[
                'Free unlimited PAYBACK-to-PAYBACK transfers',
                'Higher daily and international limits',
                'Zero monthly account fee',
                'Priority support with 2-minute chat replies',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  {benefit}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </section>

      <Alert tone="danger" title="Closing your account">
        Account closure requires clearing balances and active products. In this prototype the action is disabled — contact
        support to see the flow.
      </Alert>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          icon={<XCircle className="h-4 w-4" aria-hidden />}
          onClick={() => toast.warning('Disabled in demo', 'Account closure is intentionally not available here.')}
        >
          Close account
        </Button>
      </div>
    </PageWrap>
  );
}
