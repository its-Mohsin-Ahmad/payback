import { Building2, Pencil, ShieldCheck } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
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
import { businessAccounts, businessProfile } from '@/data/enterprise';
import { useSession } from '@/lib/session/SessionProvider';
import { businessesFor, maskPhone } from '@/lib/session/selectors';

export default function BusinessProfilePage() {
  const toast = useToast();
  // Business details resolve from the session, falling back to the demo
  // enterprise record (spec §28, §35).
  const { session } = useSession();
  const biz = businessesFor(session)[0];
  const contactName = biz?.name ?? businessProfile.primaryContact;
  const contactRole = biz?.userRole ?? businessProfile.role;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Business profile"
        description="Company details, verification and relationship information."
        actions={
          <Button variant="outline" icon={<Pencil className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo', 'Profile editing is simulated.')}>
            Edit details
          </Button>
        }
      />

      <DemoBanner label="Demo company" text="Company registration and identifiers are synthetic." />

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-6 text-white shadow-lift navy-mesh lg:col-span-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <Building2 className="h-7 w-7" aria-hidden />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold">{businessProfile.name}</h2>
                <Badge tone="emerald">KYC verified</Badge>
              </div>
              <p className="text-sm text-white/60">
                {businessProfile.industry} • Since {businessProfile.since}
              </p>
              <p className="text-xs text-white/45">
                {businessProfile.employees} employees • {businessProfile.registration}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {businessAccounts.slice(0, 3).map((account) => (
              <div key={account.id} className="rounded-xl bg-white/5 p-3">
                <p className="text-[11px] uppercase tracking-wide text-white/45">{account.name}</p>
                <p className="tnum mt-0.5 text-[13px] font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency, maximumFractionDigits: 0 }).format(account.balance)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader title="Primary contact" subtitle={businessProfile.role} />
          <CardBody className="space-y-3">
            <KeyValue
              columns={1}
              items={[
                { label: 'Name', value: contactName },
                { label: 'Role', value: contactRole },
                { label: 'Email', value: biz?.email ?? session.user.email },
                { label: 'Phone', value: maskPhone(biz?.phone ?? session.user.phone) },
              ]}
            />
            <Button variant="outline" block onClick={() => toast.info('Demo', 'Contact changes require re-verification.')}>
              Change contact
            </Button>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Company details" />
          <CardBody>
            <KeyValue
              columns={2}
              items={[
                { label: 'Legal name', value: businessProfile.legalName },
                { label: 'Registration', value: businessProfile.registration, mono: true },
                { label: 'Industry', value: businessProfile.industry },
                { label: 'Client since', value: businessProfile.since },
                { label: 'Employees', value: String(businessProfile.employees) },
                { label: 'Status', value: 'Active — good standing' },
                { label: 'Registered address', value: businessProfile.address },
                { label: 'Relationship manager', value: 'Sana Yousaf (demo)' },
              ]}
            />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Identifiers" subtitle="For invoices and inbound payments" />
            <CardBody className="space-y-4">
              <CopyField label="Company IBAN" value="PK36 SCBL 0000 0098 7654 1104" hint="Demo IBAN." />
              <CopyField label="NTN" value="4471-8" hint="National Tax Number (synthetic)." />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Business benefits" />
            <CardBody className="space-y-2.5">
              {[
                'Dual-approval workflows on every payment',
                'Bulk payouts up to 5,000 rows per file',
                'Payroll account with same-day value',
                'Dedicated relationship manager',
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

      <Alert tone="info" title="Enhanced due diligence">
        Business accounts undergo annual review. We may ask for updated beneficial-ownership documents — everything here is
        simulated.
      </Alert>
    </PageWrap>
  );
}
