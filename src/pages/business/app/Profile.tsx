import { Building2, Pencil, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrap } from '@/components/blocks';
import { BusinessLogo } from '@/components/BusinessLogo';
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
  EmptyState,
  Input,
  KeyValue,
  PageHeader,
  useToast,
} from '@/components/ui';
import { businessAccounts } from '@/data/enterprise';
import { useSession } from '@/lib/session/SessionProvider';
import { activeBusiness, businessAddress, canEditBusiness, displayName, fullName, maskPhone } from '@/lib/session/selectors';
import type { BusinessProfile } from '@/lib/session/types';

/** Editable subset of the business profile (spec §10). */
type BusinessDraft = Pick<
  BusinessProfile,
  'name' | 'legalName' | 'type' | 'industry' | 'email' | 'phone' | 'website' | 'address' | 'city' | 'country' | 'postalCode' | 'employeeCount'
>;

/** Seed the edit form from the live profile, tolerating no business yet. */
function toDraft(business: BusinessProfile | undefined): BusinessDraft {
  return {
    name: business?.name ?? '',
    legalName: business?.legalName ?? '',
    type: business?.type ?? '',
    industry: business?.industry ?? '',
    email: business?.email ?? '',
    phone: business?.phone ?? '',
    website: business?.website ?? '',
    address: business?.address ?? '',
    city: business?.city ?? '',
    country: business?.country ?? '',
    postalCode: business?.postalCode ?? '',
    employeeCount: business?.employeeCount ?? 1,
  };
}

export default function BusinessProfilePage() {
  const toast = useToast();
  const navigate = useNavigate();
  // Business details resolve from the session. `activeBusiness` falls back to the
  // first owned business, so the page always has a subject (§1, §14, §27).
  const { session, updateBusiness } = useSession();
  const user = session.user;
  const biz = activeBusiness(session);
  const canEdit = canEditBusiness(biz);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => toDraft(biz));

  // Re-seed the form whenever the active business changes, so switching context
  // can never leave another company's details in the inputs (§22, §23).
  useEffect(() => {
    setDraft(toDraft(biz));
    setEditing(false);
  }, [biz?.id]);

  if (!biz) {
    return (
      <PageWrap>
        <EmptyState
          icon={<Building2 className="h-6 w-6" aria-hidden />}
          title="No business profile yet"
          description="Create a business to unlock business banking."
          action={
            <Button onClick={() => navigate('/register')}>Create a business</Button>
          }
        />
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Business profile"
        description="Company details, verification and relationship information."
        actions={
          canEdit ? (
            <Button
              variant="outline"
              icon={<Pencil className="h-4 w-4" aria-hidden />}
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? 'Cancel editing' : 'Edit details'}
            </Button>
          ) : (
            <Badge tone="neutral">{biz.userRole} — view only</Badge>
          )
        }
      />

      <DemoBanner label="Demo company" text="Company registration and identifiers are synthetic." />

      {/* Dynamic header (spec §6, §12). Stacks on a phone — logo above, identity
          below — and sits side-by-side from `sm`. Every value comes from the
          active business, so nothing here can be stale (§11, §27). */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-navy p-5 text-white shadow-lift navy-mesh sm:p-6 lg:col-span-2">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <BusinessLogo business={biz} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-lg font-bold sm:text-xl">{biz.name}</h2>
                <Badge tone={biz.accountStatus === 'Active' ? 'emerald' : 'amber'}>
                  {biz.accountStatus === 'Active' ? 'KYC verified' : biz.accountStatus}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-white/60">
                {biz.industry} • {biz.type}
              </p>
              <p className="text-xs text-white/45">
                {biz.employeeCount} employee{biz.employeeCount === 1 ? '' : 's'} • Customer since {biz.memberSince}
              </p>
              {/* Owner is the signed-in user, never a stored name (spec §7). */}
              <p className="mt-2 text-xs font-semibold text-white/80">
                {displayName(user)} • {biz.userRole}
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

        {/* Primary contact — the individual, distinct from the company (§2, §25). */}
        <Card>
          <CardHeader title="Primary contact" subtitle={biz.userRole} />
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={fullName(user)} size="md" color="#0F172A" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{fullName(user)}</p>
                <p className="text-xs text-slate-500">{biz.userRole}</p>
              </div>
            </div>
            <KeyValue
              columns={1}
              items={[
                { label: 'Personal email', value: user.email },
                { label: 'Business email', value: biz.email },
                { label: 'Business phone', value: maskPhone(biz.phone) },
                { label: 'Website', value: biz.website || 'Not set' },
              ]}
            />
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Company details"
            action={
              canEdit ? (
                <Button variant="outline" size="sm" icon={<Pencil className="h-4 w-4" aria-hidden />} onClick={() => setEditing((v) => !v)}>
                  {editing ? 'Cancel' : 'Edit'}
                </Button>
              ) : (
                /* Employee / Viewer cannot rename the company (§24). */
                <Badge tone="neutral">View only</Badge>
              )
            }
          />
          <CardBody>
            {editing && canEdit ? (
              /* Writes through to the session, so a rename appears on the
                 dashboard, cards, invoices and reports at once (§10, §11). */
              <form
                className="grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBusiness(biz.id, draft);
                  setEditing(false);
                  toast.success('Business profile updated', 'Changes apply across all business banking.');
                }}
              >
                <Input label="Business name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
                <Input label="Legal name" value={draft.legalName} onChange={(e) => setDraft({ ...draft, legalName: e.target.value })} />
                <Input label="Business type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} />
                <Input label="Industry" value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} />
                <Input label="Business email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                <Input label="Business phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                <Input label="Website" value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} />
                <Input
                  label="Employees"
                  type="number"
                  value={String(draft.employeeCount)}
                  onChange={(e) => setDraft({ ...draft, employeeCount: Number(e.target.value) || 1 })}
                />
                <Input label="Address" className="sm:col-span-2" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
                <Input label="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                <Input label="Postal code" value={draft.postalCode} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} />
                <Input label="Country" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
                <div className="flex flex-col gap-2 sm:col-span-2 xs:flex-row xs:justify-end">
                  <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                    Discard
                  </Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            ) : (
              <KeyValue
                columns={2}
                items={[
                  { label: 'Legal name', value: biz.legalName },
                  { label: 'Registration', value: biz.registrationNumber, mono: true },
                  { label: 'Tax number', value: biz.taxNumber, mono: true },
                  { label: 'Industry', value: biz.industry },
                  { label: 'Business type', value: biz.type },
                  { label: 'Employees', value: String(biz.employeeCount) },
                  { label: 'Customer since', value: biz.memberSince },
                  { label: 'Status', value: biz.accountStatus },
                  { label: 'Registered address', value: businessAddress(biz) },
                ]}
              />
            )}
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
