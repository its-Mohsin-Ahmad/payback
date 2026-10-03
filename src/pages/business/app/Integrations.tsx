import { Plug, RefreshCw } from 'lucide-react';
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
  PageHeader,
  StatCard,
  useToast,
} from '@/components/ui';
import { businessIntegrations } from '@/data/enterprise';

export default function BusinessIntegrationsPage() {
  const toast = useToast();

  const connected = businessIntegrations.filter((i) => i.status === 'Connected').length;
  const available = businessIntegrations.filter((i) => i.status === 'Available').length;

  const connect = (name: string, status: string) => {
    if (status === 'Integration Required') {
      toast.warning('Needs setup', `${name} requires an API key from your admin (demo).`);
      return;
    }
    toast.success('Connected', `${name} linked to your workspace (demo).`);
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Manage"
        title="Integrations"
        description="Connect accounting, payroll and payout tooling to PAYBACK."
        actions={
          <Button variant="outline" icon={<RefreshCw className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Synced', 'All integration statuses refreshed (demo).')}>
            Refresh status
          </Button>
        }
      />

      <DemoBanner label="Demo integrations" text="No external system is contacted — connections are simulated." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Connected" value={String(connected)} tone="#10B981" />
        <StatCard label="Available" value={String(available)} tone="#38BDF8" />
        <StatCard label="Needs setup" value={String(businessIntegrations.length - connected - available)} tone="#F59E0B" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {businessIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-white">
                  {integration.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">{integration.name}</p>
                  <p className="text-xs text-slate-500">{integration.detail}</p>
                </div>
                <Badge
                  tone={integration.status === 'Connected' ? 'emerald' : integration.status === 'Available' ? 'sky' : 'amber'}
                >
                  {integration.status}
                </Badge>
              </div>
              <Button
                size="sm"
                variant={integration.status === 'Connected' ? 'outline' : 'primary'}
                block
                icon={<Plug className="h-4 w-4" aria-hidden />}
                onClick={() => connect(integration.name, integration.status)}
              >
                {integration.status === 'Connected' ? 'Manage connection' : integration.status === 'Available' ? 'Connect' : 'Start setup'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="API credentials" subtitle="For custom integrations" />
          <CardBody className="space-y-4">
            <CopyField label="API key (demo)" value="pk_live_••••••••••••4471" hint="Rotate keys quarterly. Never commit them to source control." />
            <CopyField label="Webhook endpoint" value="https://api.company.example/hooks/payback" hint="Receives payment.status.changed events." />
            <Button variant="outline" block onClick={() => toast.warning('Rotation simulated', 'A new key would replace the old one after 24h (demo).')}>
              Rotate API key
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Events delivered" subtitle="Last 24 hours (demo)" />
          <CardBody className="space-y-3">
            {[
              { event: 'payment.completed', count: 128 },
              { event: 'invoice.paid', count: 14 },
              { event: 'payroll.run.submitted', count: 1 },
              { event: 'approval.requested', count: 6 },
            ].map((row) => (
              <div key={row.event} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm">
                <span className="tnum font-mono text-[13px] text-slate-600">{row.event}</span>
                <span className="tnum font-semibold text-slate-900">{row.count}</span>
              </div>
            ))}
            <Alert tone="info" title="Retries with backoff">
              Failed deliveries retry for 24 hours before the integration is marked degraded.
            </Alert>
          </CardBody>
        </Card>
      </div>
    </PageWrap>
  );
}
