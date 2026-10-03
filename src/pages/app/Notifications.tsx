import { useState } from 'react';
import { Bell, CheckCheck, Gift, Megaphone, Receipt, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  EmptyState,
  PageHeader,
  SegmentedControl,
  Toggle,
  useToast,
} from '@/components/ui';
import { notifications as seed, type Notification } from '@/data/mock';

type Filter = 'All' | Notification['category'];

const iconFor = (category: Notification['category']) => {
  switch (category) {
    case 'Security':
      return <ShieldCheck className="h-5 w-5" aria-hidden />;
    case 'Transactions':
    case 'Transfers':
      return <Receipt className="h-5 w-5" aria-hidden />;
    case 'Rewards':
      return <Gift className="h-5 w-5" aria-hidden />;
    case 'Promotions':
      return <Megaphone className="h-5 w-5" aria-hidden />;
    default:
      return <Sparkles className="h-5 w-5" aria-hidden />;
  }
};

export default function NotificationsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Notification[]>(seed);
  const [filter, setFilter] = useState<Filter>('All');
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const visible = filter === 'All' ? items : items.filter((i) => i.category === filter);
  const unread = items.filter((i) => !i.read).length;

  const markAll = () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    toast.success('All caught up', 'Every notification marked as read (demo).');
  };

  const toggleRead = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: !i.read } : i)));

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Notifications"
        description="Security alerts, transaction updates and offers — in one inbox."
        actions={
          <>
            <Badge tone={unread > 0 ? 'amber' : 'emerald'} icon={<Bell className="h-3 w-3" aria-hidden />}>
              {unread} unread
            </Badge>
            <Button variant="outline" size="sm" icon={<CheckCheck className="h-4 w-4" aria-hidden />} onClick={markAll} disabled={unread === 0}>
              Mark all read
            </Button>
          </>
        }
      />

      <DemoBanner label="Demo inbox" text="These notifications were generated for demonstration and were never delivered." />

      <SegmentedControl<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'All', label: 'All', count: items.length },
          { value: 'Security', label: 'Security' },
          { value: 'Transactions', label: 'Transactions' },
          { value: 'Transfers', label: 'Transfers' },
          { value: 'Rewards', label: 'Rewards' },
          { value: 'System', label: 'System' },
          { value: 'Promotions', label: 'Promotions' },
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title="Inbox" subtitle={`${visible.length} notifications`} />
          <CardBody className="space-y-3">
            {visible.length === 0 ? (
              <EmptyState icon={<Bell className="h-6 w-6" aria-hidden />} title="Nothing here" description="No notifications in this category." />
            ) : (
              visible.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleRead(n.id)}
                  className={`focus-ring flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                    n.read ? 'border-slate-100 bg-white' : 'border-emerald-100 bg-emerald-50/50'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      n.category === 'Security' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {iconFor(n.category)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{n.title}</span>
                      {!n.read ? <Badge tone="emerald">New</Badge> : null}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500">{n.body}</span>
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {n.category} • {n.time}
                    </span>
                  </span>
                </button>
              ))
            )}
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Delivery preferences" subtitle="Choose how we reach you" />
            <CardBody className="space-y-4">
              <Toggle checked={push} onChange={setPush} label="Push notifications" hint="Instant alerts on this device" />
              <Toggle checked={email} onChange={setEmail} label="Email" hint="Detailed summaries to your inbox" />
              <Toggle checked={sms} onChange={setSms} label="SMS" hint="Security alerts only (recommended)" />
              <Toggle checked={marketing} onChange={setMarketing} label="Offers & promotions" hint="Rewards, partner deals and news" />
            </CardBody>
          </Card>

          <Alert tone="info" title="Security alerts cannot be disabled">
            Critical fraud and sign-in alerts are always sent so you can act quickly.
          </Alert>

          <Card>
            <CardBody className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <Wallet className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Quiet hours</p>
                <p className="text-xs text-slate-500">Non-critical alerts pause 10 PM – 7 AM (demo).</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </PageWrap>
  );
}
