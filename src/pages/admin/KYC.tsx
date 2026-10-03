import { useState } from 'react';
import { Check, FileSearch, X } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  PageHeader,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { adminKycQueue } from '@/data/enterprise';

type Decision = 'Approved' | 'Rejected';

export default function AdminKycPage() {
  const toast = useToast();
  const [items, setItems] = useState(adminKycQueue);

  const decide = (id: string, decision: Decision) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: decision } : item)));
    toast[decision === 'Approved' ? 'success' : 'warning'](
      decision === 'Approved' ? 'KYC approved' : 'KYC rejected',
      `${id} marked ${decision.toLowerCase()} (demo).`
    );
  };

  const pendingCount = items.filter((i) => i.status === 'Pending review').length;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Operations"
        title="KYC & onboarding"
        description="Review identity submissions and keep the queue inside SLA."
        actions={<Badge tone="amber">{pendingCount} pending review</Badge>}
      />

      <DemoBanner label="Demo KYC" text="Applicants and documents are synthetic — no PII is processed." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="In queue" value={String(pendingCount)} tone="#F59E0B" footer="Target: clear within 24h" />
        <StatCard label="In review" value={String(items.filter((i) => i.status === 'In review').length)} tone="#38BDF8" />
        <StatCard label="Needs more info" value={String(items.filter((i) => i.status === 'Additional info needed').length)} tone="#8B5CF6" />
      </div>

      <Card>
        <CardHeader title="Review queue" subtitle={`${items.length} applications`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Applicant</Th>
              <Th className="hidden md:table-cell">Type</Th>
              <Th className="hidden md:table-cell">Documents</Th>
              <Th>Risk</Th>
              <Th className="hidden lg:table-cell">Submitted</Th>
              <Th align="right">Status</Th>
              <Th align="right">Decision</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <Tr key={row.id}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{row.id}</Td>
                <Td className="font-semibold text-slate-800">{row.user}</Td>
                <Td className="hidden md:table-cell text-xs">{row.type}</Td>
                <Td className="hidden md:table-cell text-xs text-slate-500">{row.documents}</Td>
                <Td>
                  <Badge tone={row.risk === 'High' ? 'rose' : row.risk === 'Medium' ? 'amber' : 'emerald'}>{row.risk}</Badge>
                </Td>
                <Td className="hidden lg:table-cell text-xs text-slate-500">{row.submitted}</Td>
                <Td align="right">
                  <Badge
                    tone={
                      row.status === 'Approved'
                        ? 'emerald'
                        : row.status === 'Rejected'
                          ? 'rose'
                          : row.status === 'In review'
                            ? 'sky'
                            : row.status === 'Additional info needed'
                              ? 'violet'
                              : 'amber'
                    }
                  >
                    {row.status}
                  </Badge>
                </Td>
                <Td align="right">
                  {row.status === 'Approved' || row.status === 'Rejected' ? (
                    <span className="text-xs text-slate-400">Closed</span>
                  ) : (
                    <div className="flex justify-end gap-1.5">
                      <Button size="xs" icon={<Check className="h-3.5 w-3.5" aria-hidden />} onClick={() => decide(row.id, 'Approved')}>
                        Approve
                      </Button>
                      <Button size="xs" variant="danger" icon={<X className="h-3.5 w-3.5" aria-hidden />} onClick={() => decide(row.id, 'Rejected')}>
                        Reject
                      </Button>
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Escalation policy">
        High-risk applicants and any hit against sanctions lists auto-escalate to the Compliance Officer regardless of the
        decision made here (demo policy).
      </Alert>

      <div className="flex justify-end">
        <Button variant="outline" icon={<FileSearch className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Bulk review', 'Bulk decision tool is simulated.')}>
          Bulk review
        </Button>
      </div>
    </PageWrap>
  );
}
