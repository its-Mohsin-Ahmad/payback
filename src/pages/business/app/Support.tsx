import { useState } from 'react';
import { Headphones, Send } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Accordion,
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
  Textarea,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { Icon } from '@/components/Icon';
import { supportChannels, supportFaqs, supportTickets } from '@/data/products';

export default function BusinessSupportPage() {
  const toast = useToast();
  const [message, setMessage] = useState('');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Business support"
        description="Priority queue for business customers — average first reply under 5 minutes."
        actions={
          <Badge tone="emerald" icon={<Headphones className="h-3 w-3" aria-hidden />}>
            Priority line active
          </Badge>
        }
      />

      <DemoBanner label="Demo support" text="No real agent is available — chats and tickets are simulated locally." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supportChannels.map((channel) => (
          <Card key={channel.id}>
            <CardBody className="space-y-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${channel.tone}1a`, color: channel.tone }}>
                <Icon name={channel.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{channel.name}</p>
                <p className="text-xs text-slate-500">{channel.detail}</p>
              </div>
              <Button size="sm" variant="outline" block onClick={() => toast.info(channel.name, `${channel.action} — simulated in this prototype.`)}>
                {channel.action}
              </Button>
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Business FAQs" subtitle="Account servicing, payments and compliance" />
          <CardBody>
            <Accordion items={supportFaqs.map((faq) => ({ title: faq.q, body: faq.a }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Raise a request" subtitle="Payroll, limits, KYC or technical" />
          <CardBody className="space-y-3">
            <Textarea
              label="Describe your request"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Include invoice numbers, payroll runs or user IDs where relevant…"
              rows={5}
              hint="Never include passwords, PINs or full card numbers."
            />
            <Button
              block
              icon={<Send className="h-4 w-4" aria-hidden />}
              disabled={message.trim().length < 10}
              onClick={() => {
                setMessage('');
                toast.success('Request raised', 'Ticket BK-1180 created (demo).');
              }}
            >
              Submit request
            </Button>
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader title="Open tickets" subtitle="Tracked against your SLA" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Reference</Th>
              <Th>Subject</Th>
              <Th className="hidden md:table-cell">Category</Th>
              <Th className="hidden md:table-cell">Priority</Th>
              <Th className="hidden lg:table-cell">Updated</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {supportTickets.map((ticket) => (
              <Tr key={ticket.id}>
                <Td className="tnum font-mono text-[13px] font-semibold text-slate-900">{ticket.id}</Td>
                <Td className="font-semibold text-slate-800">{ticket.subject}</Td>
                <Td className="hidden md:table-cell text-xs">{ticket.category}</Td>
                <Td className="hidden md:table-cell">
                  <Badge tone={ticket.priority === 'High' ? 'rose' : ticket.priority === 'Medium' ? 'amber' : 'neutral'}>
                    {ticket.priority}
                  </Badge>
                </Td>
                <Td className="hidden lg:table-cell text-xs text-slate-500">{ticket.updated}</Td>
                <Td align="right">
                  <StatusBadge status={ticket.status} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Dedicated relationship manager">
        Your RM responds within one business day for anything that cannot wait for the priority queue (simulated).
      </Alert>
    </PageWrap>
  );
}
