import { Link } from 'react-router-dom';
import { ArrowRight, Clock, LifeBuoy, Mail, MapPin, MessageCircle, Phone, Ticket } from 'lucide-react';
import { Accordion, Card, CardBody, DemoBanner, SecurityBadge } from '@/components/ui';
import { supportChannels, supportFaqs } from '@/data/products';

const statusItems = [
  { k: 'App', v: 'Operational', tone: '#10B981' },
  { k: 'Transfers', v: 'Operational', tone: '#10B981' },
  { k: 'Local bank rail', v: 'Degraded', tone: '#F59E0B' },
  { k: 'International rail', v: 'Operational', tone: '#10B981' },
  { k: 'Wallet providers', v: 'Simulated', tone: '#8B5CF6' },
];

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-content space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Support</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Help, fast and human</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Average first reply under two minutes on chat, 24/7 on the helpline, and a full ticket system for anything complex.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <SecurityBadge label="24/7 helpline" />
          <SecurityBadge label="Average reply &lt; 2 min" />
        </div>
      </header>

      <DemoBanner label="Prototype support" text="Channels, replies and tickets in this demo are simulated." />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supportChannels.map((channel, index) => {
          const icons = [MessageCircle, Phone, Mail, Ticket];
          const ChannelIcon = icons[index % icons.length];
          return (
            <Card key={channel.id}>
              <CardBody className="space-y-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${channel.tone}1a`, color: channel.tone }}>
                  <ChannelIcon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{channel.name}</p>
                  <p className="text-xs text-slate-500">{channel.detail}</p>
                </div>
                <Link to="/app/support" className="focus-ring inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  {channel.action} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardBody className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Frequently asked questions</h2>
            <Accordion items={supportFaqs.map((faq) => ({ title: faq.q, body: faq.a }))} />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <h2 className="text-base font-semibold text-slate-900">System status</h2>
              <div className="space-y-2">
                {statusItems.map((item) => (
                  <div key={item.k} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.k}</span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.tone }} aria-hidden />
                      {item.v}
                    </span>
                  </div>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="h-3 w-3" aria-hidden /> Updated 5 minutes ago (demo)
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-3">
              <h2 className="text-base font-semibold text-slate-900">Visit or call us</h2>
              <p className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                Main Boulevard, Gulberg III, Lahore, Pakistan
              </p>
              <p className="flex items-start gap-2.5 text-sm text-slate-600">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                24/7 helpline • +92 21 ••• 0100
              </p>
              <p className="flex items-start gap-2.5 text-sm text-slate-600">
                <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                Branch hours 09:00 – 17:00, Monday to Saturday
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      <Card>
        <CardBody className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-lg font-bold text-slate-900">Still stuck?</h2>
          <p className="max-w-lg text-sm text-slate-500">
            Open the in-app support centre to message an agent, track tickets and see your request history in one place.
          </p>
          <Link
            to="/app/support"
            className="focus-ring inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600"
          >
            Open support centre
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}