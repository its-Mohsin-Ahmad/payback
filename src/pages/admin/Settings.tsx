import { useState } from 'react';
import { Save, TriangleAlert } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  Select,
  StatCard,
  Toggle,
  useToast,
} from '@/components/ui';
import { adminMetrics } from '@/data/enterprise';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [autoSuspend, setAutoSuspend] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [maintenanceBanner, setMaintenanceBanner] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Governance"
        title="Platform settings"
        description="Global security, compliance and operational defaults."
        actions={
          <Button
            icon={<Save className="h-4 w-4" aria-hidden />}
            onClick={() => toast.success('Settings saved', 'Platform configuration updated (demo).')}
          >
            Save settings
          </Button>
        }
      />

      <DemoBanner label="Demo settings" text="Changes here affect local prototype state only." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Platform uptime" value={`${adminMetrics.uptime}%`} delta={0.02} tone="#10B981" />
        <StatCard label="Queue depth" value={String(adminMetrics.supportQueue + adminMetrics.pendingKyc)} tone="#F59E0B" footer="Support + KYC" />
        <StatCard label="Fraud flags (24h)" value={String(adminMetrics.fraudFlagged)} tone="#EF4444" />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Security" subtitle="Applies to all internal staff" />
          <CardBody className="space-y-4">
            <Toggle checked={mfaEnforced} onChange={setMfaEnforced} label="Enforce MFA for staff" hint="Required for every admin role" />
            <Toggle checked={ipAllowlist} onChange={setIpAllowlist} label="IP allowlist" hint="Restrict admin access to office/VPN ranges" />
            <Select
              label="Session timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
              ]}
              hint="Inactivity timeout for admin sessions."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Compliance & operations" subtitle="Automated controls" />
          <CardBody className="space-y-4">
            <Toggle
              checked={autoSuspend}
              onChange={setAutoSuspend}
              label="Auto-suspend suspicious accounts"
              hint="Freeze accounts on confirmed fraud signals"
            />
            <Toggle
              checked={maintenanceBanner}
              onChange={setMaintenanceBanner}
              label="Show maintenance banner"
              hint="Displays a customer-facing notice"
            />
            {maintenanceBanner ? (
              <Alert tone="warning" title="Banner is live">
                Customers would see the maintenance notice on the app and marketing site (demo).
              </Alert>
            ) : null}
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader
          title="Environment"
          subtitle="Build and deployment information"
          action={<Badge tone="violet">Prototype</Badge>}
        />
        <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Environment', v: 'Demo / staging' },
            { k: 'Version', v: '1.0.0' },
            { k: 'Data source', v: 'Synthetic fixtures' },
            { k: 'Real rails', v: 'None connected' },
          ].map((item) => (
            <div key={item.k} className="rounded-xl bg-slate-50 p-3.5">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.k}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{item.v}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <Alert tone="danger" title="Danger zone">
        <span className="inline-flex items-center gap-1.5">
          <TriangleAlert className="h-3.5 w-3.5" aria-hidden />
          Resetting the platform or purging demo data requires two Super Admins. This action is disabled in the prototype.
        </span>
      </Alert>

      <div className="flex justify-end">
        <Button variant="danger" onClick={() => toast.error('Blocked', 'Two-admin approval is required (demo).')}>
          Purge demo data
        </Button>
      </div>
    </PageWrap>
  );
}