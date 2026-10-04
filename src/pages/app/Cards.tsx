import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  Snowflake,
  Smartphone,
  Zap,
} from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { CardCarousel } from '@/components/card3d';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Input,
  Modal,
  OtpInput,
  PageHeader,
  ProgressBar,
  StatCard,
  Toggle,
  useToast,
} from '@/components/ui';
import { cardUtilisation, paybackCards, secureSim, type PaybackCard } from '@/lib/cardData';
import { CardsSkeleton } from '@/components/loaders';
import { money } from '@/lib/utils';

type AuthAction = 'freeze' | 'unfreeze' | 'replace' | 'pin' | null;

export default function CardsPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [cards, setCards] = useState<PaybackCard[]>(paybackCards);
  const [activeId, setActiveId] = useState(paybackCards[0].id);
  const [showPan, setShowPan] = useState(false);
  const [auth, setAuth] = useState<AuthAction>(null);
  const [otp, setOtp] = useState('');
  const [pinRevealed, setPinRevealed] = useState(false);
  const [limitsOpen, setLimitsOpen] = useState(false);
  const [dailyLimit, setDailyLimit] = useState('500');
  const [monthlyLimit, setMonthlyLimit] = useState('5000');
  const [simOpen, setSimOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Hold a skeleton frame until the card set has "arrived".
   *
   * This also guarantees the carousel mounts at its final width, so the centre
   * calculation runs against real geometry rather than a zero-width track.
   */
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <PageWrap>
        <CardsSkeleton />
      </PageWrap>
    );
  }

  const active = cards.find((c) => c.id === activeId) ?? cards[0];
  const patch = (changes: Partial<PaybackCard>) =>
    setCards((prev) => prev.map((c) => (c.id === active.id ? { ...c, ...changes } : c)));

  const totals = {
    limit: cards.reduce((s, c) => s + c.limit, 0),
    spent: cards.reduce((s, c) => s + c.spent, 0),
    frozen: cards.filter((c) => c.status === 'Frozen').length,
  };

  const runAuthedAction = () => {
    if (otp.length !== 6) {
      toast.error('Verification required', 'Enter the 6-digit code to continue.');
      return;
    }
    const label = active.identity.name;
    if (auth === 'freeze') {
      patch({ status: 'Frozen' });
      toast.warning('Card frozen', `${label} will decline new payments (demo).`);
    } else if (auth === 'unfreeze') {
      patch({ status: 'Active' });
      toast.success('Card active', `${label} accepts payments again (demo).`);
    } else if (auth === 'replace') {
      patch({ status: 'Active', spent: 0 });
      toast.success('Replacement ordered', `A new ${label} arrives in 3–5 days (demo).`);
    } else if (auth === 'pin') {
      setPinRevealed(true);
      toast.success('Identity confirmed', 'Demo PIN panel unlocked for this session.');
    }
    setAuth(null);
    setOtp('');
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Move money"
        title="Your Cards"
        description="Manage your PAYBACK cards, payments, limits and security controls."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={showPan ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
              onClick={() => setShowPan((v) => !v)}
            >
              {showPan ? 'Mask number' : 'Reveal demo number'}
            </Button>
            <Button size="sm" icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Demo only', 'New card issuance is simulated.')}>
              Order new card
            </Button>
          </>
        }
      />

      <DemoBanner
        label="Demo cards"
        text="Cards, numbers, limits and secure elements are illustrative. No physical or virtual card is issued and no card network is involved."
      />

      {/* Premium 3D gallery */}
      <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-4 shadow-card sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{active.identity.name}</h2>
            <p className="text-sm text-slate-500">{active.identity.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={active.status === 'Active' ? 'emerald' : active.status === 'Frozen' ? 'amber' : 'rose'}>{active.status}</Badge>
            <Badge tone="navy">{active.type}</Badge>
            {active.virtual ? <Badge tone="sky">Digital only</Badge> : null}
            {active.secureElement.present ? (
              <Badge tone="violet" icon={<Fingerprint className="h-3 w-3" aria-hidden />}>
                Secure element
              </Badge>
            ) : null}
          </div>
        </div>

        <CardCarousel
          cards={cards}
          activeId={activeId}
          onActiveChange={setActiveId}
          size="md"
          showPan={showPan}
          className="mt-4"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Combined limit" value={money(totals.limit, 'USD', { decimals: false })} tone="#10B981" />
        <StatCard label="Spent this cycle" value={money(totals.spent, 'USD', { decimals: false })} tone="#38BDF8" />
        <StatCard label="Frozen cards" value={String(totals.frozen)} tone="#F59E0B" footer={totals.frozen === 0 ? 'All cards active' : 'Payments blocked'} />
        <StatCard
          label="Security state"
          value="Protected"
          tone="#8B5CF6"
          footer={`${cards.filter((c) => c.secureElement.present).length} secure elements active`}
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader
            title="Payment controls"
            subtitle={`Applies instantly to ${active.identity.name} •••• ${active.last4}`}
            action={<Badge tone={active.status === 'Active' ? 'emerald' : 'amber'}>{active.status}</Badge>}
          />
          <CardBody className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Toggle checked={active.online} onChange={(v) => patch({ online: v })} label="Online payments" hint="E-commerce and in-app purchases" />
              <Toggle checked={active.international} onChange={(v) => patch({ international: v })} label="International payments" hint="Payments outside your home country" />
              <Toggle checked={active.contactless} onChange={(v) => patch({ contactless: v })} label="Contactless" hint="Tap to pay at terminals" />
              <Toggle checked={active.atm} onChange={(v) => patch({ atm: v })} label="ATM withdrawals" hint="Cash access at machines" />
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <ProgressBar
                value={active.spent}
                max={active.limit}
                label="Monthly spend"
                tone={cardUtilisation(active) > 80 ? '#F43F5E' : '#10B981'}
              />
              <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Available</dt>
                  <dd className="tnum font-bold text-slate-900">{money(active.limit - active.spent, active.currency, { decimals: false })}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Daily limit</dt>
                  <dd className="tnum font-bold text-slate-900">{money(active.dailyLimit, active.currency, { decimals: false })}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">Monthly limit</dt>
                  <dd className="tnum font-bold text-slate-900">{money(active.monthlyLimit, active.currency, { decimals: false })}</dd>
                </div>
              </dl>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Card summary" subtitle={active.identity.finish + ' finish'} />
            <CardBody className="space-y-3">
              <dl className="space-y-2 text-sm">
                {[
                  { k: 'Card status', v: active.status },
                  { k: 'Card type', v: `${active.identity.name} • ${active.type}` },
                  { k: 'Network', v: `${active.identity.network} (demo)` },
                  { k: 'Card number', v: showPan ? active.demoPan : active.maskedPan },
                  { k: 'Expires', v: active.expiry },
                  { k: 'Currency', v: active.currency },
                  { k: 'Card security', v: 'Protected' },
                ].map((row) => (
                  <div key={row.k} className="flex items-center justify-between gap-3">
                    <dt className="text-slate-500">{row.k}</dt>
                    <dd className="text-right font-semibold text-slate-900">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Fingerprint className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">{active.secureElement.label}</p>
                      <Badge tone={active.secureElement.state === 'Active' ? 'emerald' : 'neutral'}>{active.secureElement.state}</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">{active.secureElement.detail}</p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                block
                icon={<Smartphone className="h-4 w-4" aria-hidden />}
                onClick={() => setSimOpen(true)}
              >
                Manage PAYBACK Secure SIM
              </Button>
            </CardBody>
          </Card>

          <Alert tone="info" title="Card security">
            Your PIN, CVV and full card number are never shown in the app. Revealing the demo number above is a visual
            demonstration only — real cards keep secrets inside the secure element.
          </Alert>
        </div>
      </section>

      {/* Quick actions */}
      <Card>
        <CardHeader
          title="Quick actions"
          subtitle="Sensitive actions ask for verification first"
          action={<Badge tone="violet" icon={<ShieldCheck className="h-3 w-3" aria-hidden />}>Protected</Badge>}
        />
        <CardBody className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant={active.status === 'Frozen' ? 'primary' : 'danger'}
            icon={<Snowflake className="h-4 w-4" aria-hidden />}
            onClick={() => setAuth(active.status === 'Frozen' ? 'unfreeze' : 'freeze')}
          >
            {active.status === 'Frozen' ? 'Unfreeze card' : 'Freeze card'}
          </Button>
          <Button
            variant="outline"
            icon={<Zap className="h-4 w-4" aria-hidden />}
            onClick={() => {
              patch({ status: 'Active' });
              toast.success('Card activated', `${active.identity.name} is active (demo).`);
            }}
          >
            Activate card
          </Button>
          <Button variant="outline" icon={<RefreshCw className="h-4 w-4" aria-hidden />} onClick={() => setAuth('replace')}>
            Replace card
          </Button>
          <Button variant="outline" icon={<CreditCard className="h-4 w-4" aria-hidden />} onClick={() => setLimitsOpen(true)}>
            Set limits
          </Button>
          <Button variant="outline" icon={<Zap className="h-4 w-4" aria-hidden />} onClick={() => navigate('/app/transactions')}>
            View transactions
          </Button>
          <Button variant="outline" icon={<KeyRound className="h-4 w-4" aria-hidden />} onClick={() => setAuth('pin')}>
            View PIN
          </Button>
          <Button variant="outline" icon={<ShieldCheck className="h-4 w-4" aria-hidden />} onClick={() => navigate('/app/security')}>
            Card security
          </Button>
          <Button variant="ghost" onClick={() => navigate('/app/settings')}>Card settings</Button>
        </CardBody>
      </Card>

      {/* Authentication gate for sensitive actions */}
      <Modal
        open={auth !== null}
        onClose={() => {
          setAuth(null);
          setOtp('');
        }}
        title="Confirm it is you"
        description={
          auth === 'freeze'
            ? 'Freezing blocks new payments immediately.'
            : auth === 'unfreeze'
              ? 'Unfreezing allows this card to spend again.'
              : auth === 'replace'
                ? 'We will cancel this card and issue a new one.'
                : 'Unlock your PIN panel for this session.'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setAuth(null)}>
              Cancel
            </Button>
            <Button icon={<ShieldCheck className="h-4 w-4" aria-hidden />} onClick={runAuthedAction}>
              Confirm
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <KeyRound className="h-6 w-6" aria-hidden />
          </span>
          <div className="flex justify-center">
            <OtpInput length={6} value={otp} onChange={setOtp} />
          </div>
          <p className="text-xs text-slate-500">Any 6 digits work in this prototype.</p>
        </div>
      </Modal>

      {/* PIN — never displayed, only a secure-handling explanation */}
      <Modal
        open={pinRevealed}
        onClose={() => setPinRevealed(false)}
        title="Your PIN stays private"
        description="Identity confirmed for this session"
        footer={
          <Button onClick={() => setPinRevealed(false)}>Close</Button>
        }
      >
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            PAYBACK never displays, emails or logs your card PIN — not even after verification.
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            Use biometric sign-in or your password for in-app approvals instead.
          </div>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            If you have forgotten your PIN, request a reset — it cannot be recovered in-app.
          </div>
        </div>
      </Modal>

      {/* Limits */}
      <Modal
        open={limitsOpen}
        onClose={() => setLimitsOpen(false)}
        title="Set card limits"
        description={`Applies to ${active.identity.name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setLimitsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                patch({
                  dailyLimit: Number(dailyLimit) || active.dailyLimit,
                  monthlyLimit: Number(monthlyLimit) || active.monthlyLimit,
                  limit: Number(monthlyLimit) || active.limit,
                });
                setLimitsOpen(false);
                toast.success('Limits updated', 'Changes apply to new authorisations (demo).');
              }}
            >
              Save limits
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Daily spending limit"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            leftIcon={<span className="text-sm font-bold text-slate-400">$</span>}
          />
          <Input
            label="Monthly spending limit"
            type="number"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            leftIcon={<span className="text-sm font-bold text-slate-400">$</span>}
          />
          <Alert tone="info" title="Approvals">
            Payments above your daily limit require step-up verification before they are released.
          </Alert>
        </div>
      </Modal>

      {/* Secure SIM concept */}
      <Modal
        open={simOpen}
        onClose={() => setSimOpen(false)}
        title={secureSim.name}
        description={secureSim.tagline}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSimOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setSimOpen(false);
                toast.success('Secure SIM healthy', 'Device binding re-checked (demo).');
              }}
            >
              Re-verify device
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Status</p>
                <p className="text-xs text-slate-500">{secureSim.activation}</p>
              </div>
              <Badge tone="emerald">{secureSim.status}</Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">Device</p>
                <p className="text-xs text-slate-500">{secureSim.device}</p>
              </div>
              <Badge tone="sky">{secureSim.securityState}</Badge>
            </div>
          </div>

          <ul className="space-y-2">
            {secureSim.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>

          <Alert tone="warning" title="Concept only">{secureSim.disclaimer}</Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}