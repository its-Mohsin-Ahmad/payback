import { Calendar, Download, FileText, Play } from 'lucide-react';
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
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';

const reportCatalog = [
  { id: 'rc-1', name: 'Regulatory volume report', detail: 'Daily transaction volume by rail and region', cadence: 'Daily', tone: '#10B981' },
  { id: 'rc-2', name: 'KYC throughput', detail: 'Approvals, rejections and ageing of the queue', cadence: 'Weekly', tone: '#38BDF8' },
  { id: 'rc-3', name: 'Dispute & chargeback pack', detail: 'Open cases, SLA breaches and outcomes', cadence: 'Weekly', tone: '#F59E0B' },
  { id: 'rc-4', name: 'Fraud & AML digest', detail: 'Flagged transactions, rule hits and investigations', cadence: 'Daily', tone: '#EF4444' },
  { id: 'rc-5', name: 'Revenue & fee reconciliation', detail: 'Fees charged vs settled per product', cadence: 'Monthly', tone: '#8B5CF6' },
  { id: 'rc-6', name: 'Platform uptime report', detail: 'Rail latency, incidents and maintenance windows', cadence: 'Monthly', tone: '#14B8A6' },
];

const schedule = [
  { id: 'SCH-01', name: 'Regulatory volume report', owner: 'Compliance Officer', next: 'Apr 26, 2025 • 06:00', format: 'CSV + PDF', status: 'Active' },
  { id: 'SCH-02', name: 'Fraud & AML digest', owner: 'Risk Analyst', next: 'Apr 26, 2025 • 07:00', format: 'PDF', status: 'Active' },
  { id: 'SCH-03', name: 'Revenue & fee reconciliation', owner: 'Finance Ops', next: 'May 01, 2025 • 09:00', format: 'XLSX', status: 'Active' },
  { id: 'SCH-04', name: 'Board pack (Q2)', owner: 'Super Admin', next: 'Jul 05, 2025 • 08:00', format: 'PDF', status: 'Paused' },
];

export default function AdminReportsPage() {
  const toast = useToast();

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Overview"
        title="Reports"
        description="Generate, schedule and distribute operational reports."
        actions={
          <Button icon={<Play className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Custom report', 'Report builder is simulated in this prototype.')}>
            Build custom report
          </Button>
        }
      />

      <DemoBanner label="Demo reports" text="No report is actually generated or emailed — actions are simulated." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportCatalog.map((report) => (
          <Card key={report.id}>
            <CardBody className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${report.tone}1a`, color: report.tone }}>
                  <FileText className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{report.name}</p>
                  <p className="text-xs text-slate-500">{report.detail}</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <Badge tone="neutral">{report.cadence}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Download className="h-4 w-4" aria-hidden />}
                  onClick={() => toast.success('Report queued', `${report.name} will be ready shortly (demo).`)}
                >
                  Run now
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader
          title="Scheduled deliveries"
          subtitle="Automatic distribution to stakeholder lists"
          action={
            <Button size="sm" variant="ghost" icon={<Calendar className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Scheduler', 'Scheduling UI is simulated.')}>
              New schedule
            </Button>
          }
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Report</Th>
              <Th className="hidden md:table-cell">Owner</Th>
              <Th className="hidden lg:table-cell">Next run</Th>
              <Th className="hidden md:table-cell">Format</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <Tr key={row.id}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{row.id}</Td>
                <Td className="font-semibold text-slate-800">{row.name}</Td>
                <Td className="hidden md:table-cell text-xs">{row.owner}</Td>
                <Td className="hidden lg:table-cell text-xs text-slate-500">{row.next}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{row.format}</Td>
                <Td align="right">
                  <StatusBadge status={row.status === 'Active' ? 'Active' : 'Paused'} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Data classification">
        All reports inherit the platform's redaction rules — PII is masked unless the viewer holds the Compliance role
        (demo policy).
      </Alert>
    </PageWrap>
  );
}
