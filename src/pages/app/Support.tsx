import { useState } from 'react';
import { LifeBuoy, MessageCircle, Send } from 'lucide-react';
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

export default function SupportPage() {
  const toast = useToast();
  const [message, setMessage] = useState('');

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Help & support"
        description="Chat, call, email or raise a ticket — average first reply under 2 minutes."
        actions={
          <Badge tone="emerald" icon={<LifeBuoy className="h-3 w-3" aria-hidden />}>
            All systems operational
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
              <Button
                size="sm"
                variant="outline"
                block
                onClick={() =>
                  channel.name === 'Live Chat'
                    ? toast.info('Chat connecting', 'An agent would join within 2 minutes (demo).')
                    : toast.info(channel.name, `${channel.action} — simulated in this prototype.`)
                }
              >
                {channel.action}
              </Button>
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader title="Frequently asked questions" subtitle="Answers to the most common questions" />
          <CardBody>
            <Accordion items={supportFaqs.map((faq) => ({ title: faq.q, body: faq.a }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Send us a message" subtitle="We reply by email within 24h" />
          <CardBody className="space-y-3">
            <Textarea
              label="How can we help?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue — include references where relevant…"
              rows={5}
              hint="Never include passwords, PINs or full card numbers."
            />
            <Button
              block
              icon={<Send className="h-4 w-4" aria-hidden />}
              disabled={message.trim().length < 10}
              onClick={() => {
                setMessage('');
                toast.success('Message sent', 'Ticket TK-4899 created (demo).');
              }}
            >
              Send message
            </Button>
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader title="Your tickets" subtitle="Track complaints and requests end to end" />
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

      <Alert tone="info" title="Scam hotline">
        If you suspect fraud, call the 24/7 helpline printed on the back of your card and freeze your cards from the Cards
        screen immediately.
      </Alert>

      <div className="flex justify-center pb-2">
        <Button
          variant="ghost"
          icon={<MessageCircle className="h-4 w-4" aria-hidden />}
          onClick={() => toast.info('Feedback', 'Thanks — the feedback form is simulated in this build.')}
        >
          Give product feedback
        </Button>
      </div>
    </PageWrap>
  );
}
