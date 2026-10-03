import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
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
  StatCard,
  Toggle,
  useToast,
} from '@/components/ui';
import { adminIntegrationHealth, adminMetrics } from '@/data/enterprise';

export default function AdminIntegrationsPage() {
  const toast = useToast();
  const [autoHeal, setAutoHeal] = useState(true);
  const [failover, setFailover] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const degraded = adminIntegrationHealth.filter((i) => i.status === 'Degraded').length;
  const simulated = adminIntegrationHealth.filter((i) => i.status === 'Simulated').length;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Configuration"
        title="Integrations"
        description="Rails, providers and platform services — health, latency and controls."
        actions={
          <Button
            variant="outline"
            icon={<RefreshCw className="h-4 w-4" aria-hidden />}
            onClick={() => toast.success('Health refreshed', 'All services re-checked (demo).')}
          >
            Refresh health
          </Button>
        }
      />

      <DemoBanner label="Demo infrastructure" text="Latency, uptime and statuses are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Services monitored" value={String(adminIntegrationHealth.length)} tone="#10B981" />
        <StatCard label="Degraded" value={String(degraded)} tone="#F59E0B" footer="Local Bank Rail is slow" />
        <StatCard label="Simulated (demo)" value={String(simulated)} tone="#8B5CF6" footer="Wallet providers are not connected" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {adminIntegrationHealth.map((integration) => (
          <Card key={integration.id}>
            <CardHeader
              title={integration.name}
              subtitle={`${integration.latency} • ${integration.uptime} uptime`}
              action={
                <Badge tone={integration.status === 'Operational' ? 'emerald' : integration.status === 'Degraded' ? 'amber' : 'violet'}>
                  {integration.status}
                </Badge>
              }
            />
            <CardBody className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info('Logs', `${integration.name} logs opened (demo).`)}>
                  View logs
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.warning('Simulated', `${integration.name} restarted (demo).`)}>
                  Restart
                </Button>
              </div>
              {integration.status === 'Degraded' ? (
                <Alert tone="warning" title="Latency above threshold">
                  Auto-failover has moved part of the traffic to the backup rail. Investigating (demo).
                </Alert>
              ) : null}
              {integration.status === 'Simulated' ? (
                <Alert tone="info" title="Not connected">
                  This provider is represented for demonstration only and never called.
                </Alert>
              ) : null}
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Platform controls" subtitle="Global behaviour during incidents" />
        <CardBody className="space-y-4">
          <Toggle checked={autoHeal} onChange={setAutoHeal} label="Automatic healing" hint="Restart unhealthy services automatically" />
          <Toggle checked={failover} onChange={setFailover} label="Traffic failover" hint={`Reroute to backups automatically (platform uptime ${adminMetrics.uptime}%)`} />
          <Toggle
            checked={maintenanceMode}
            onChange={setMaintenanceMode}
            label="Maintenance mode"
            hint="Shows a maintenance banner to customers"
          />
          {maintenanceMode ? (
            <Alert tone="danger" title="Maintenance mode is ON">
              Customers would currently see a scheduled-maintenance notice (demo only).
            </Alert>
          ) : null}
        </CardBody>
      </Card>
    </PageWrap>
  );
}