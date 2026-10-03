import { useState } from 'react';
import { Plus, Search, Send, Star, Trash2, Users } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  Input,
  Modal,
  PageHeader,
  SegmentedControl,
  Select,
  useToast,
} from '@/components/ui';
import { PROVIDERS } from '@/data/products';
import { recipients as seed, type Recipient } from '@/data/mock';

type Tab = 'favourites' | 'all' | 'unverified';

export default function BeneficiariesPage() {
  const toast = useToast();
  const [items, setItems] = useState<Recipient[]>(seed);
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftProvider, setDraftProvider] = useState('PAYBACK');
  const [draftIdentifier, setDraftIdentifier] = useState('');

  const visible = items.filter((r) => {
    if (tab === 'favourites' && !r.favourite) return false;
    if (tab === 'unverified' && r.verified) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.identifier.toLowerCase().includes(q) ||
      r.provider.toLowerCase().includes(q)
    );
  });

  const toggleFavourite = (id: string) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, favourite: !r.favourite } : r)));

  const remove = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    toast.warning('Beneficiary removed', 'You can add them again at any time (demo).');
  };

  const add = () => {
    if (!draftName.trim() || !draftIdentifier.trim()) {
      toast.error('Missing details', 'Enter a name and an account identifier.');
      return;
    }
    setItems((prev) => [
      {
        id: `rcp-${Date.now()}`,
        name: draftName.trim(),
        provider: draftProvider,
        identifier: draftIdentifier.trim(),
        favourite: false,
        verified: false,
        initialsColor: '#10B981',
      },
      ...prev,
    ]);
    setDraftName('');
    setDraftIdentifier('');
    setAddOpen(false);
    toast.success('Beneficiary saved', 'New recipients stay unverified for 24 hours (demo).');
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Move money"
        title="Beneficiaries"
        description="Saved recipients you can pay in a couple of taps."
        actions={
          <Button icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setAddOpen(true)}>
            Add beneficiary
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: 'All', count: items.length },
            { value: 'favourites', label: 'Favourites', count: items.filter((i) => i.favourite).length },
            { value: 'unverified', label: 'Unverified', count: items.filter((i) => !i.verified).length },
          ]}
        />
        <div className="sm:w-72">
          <Input
            placeholder="Search name, provider or number…"
            leftIcon={<Search className="h-4 w-4" aria-hidden />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search beneficiaries"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Users className="h-6 w-6" aria-hidden />}
              title="No beneficiaries found"
              description="Adjust your filters or add a new recipient to get started."
              action={
                <Button size="sm" icon={<Plus className="h-4 w-4" aria-hidden />} onClick={() => setAddOpen(true)}>
                  Add beneficiary
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((r) => (
            <Card key={r.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar name={r.name} color={r.initialsColor} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-900">{r.name}</p>
                      {r.verified ? <Badge tone="emerald">Verified</Badge> : <Badge tone="amber">Unverified</Badge>}
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      {r.provider} • {r.identifier}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavourite(r.id)}
                    aria-label={r.favourite ? 'Remove favourite' : 'Add favourite'}
                    className={`focus-ring rounded-lg p-1.5 transition-colors ${
                      r.favourite ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${r.favourite ? 'fill-current' : ''}`} aria-hidden />
                  </button>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                  <a
                    href="/app/transfer"
                    className="focus-ring inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-emerald-600"
                  >
                    <Send className="h-4 w-4" aria-hidden /> Send
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(r.id)}
                    aria-label={`Remove ${r.name}`}
                    className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Alert tone="info" title="Verification protects you">
        Recipients stay unverified for 24 hours after being added, and payments above your tier limit always require
        two-factor verification.
      </Alert>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add beneficiary"
        description="Save a recipient for faster payments next time."
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add}>Save beneficiary</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" placeholder="e.g. Ali Raza" value={draftName} onChange={(e) => setDraftName(e.target.value)} />
          <Select
            label="Provider / rail"
            value={draftProvider}
            onChange={(e) => setDraftProvider(e.target.value)}
            options={PROVIDERS.filter((p) => p.id !== 'paypal').map((p) => ({ value: p.name, label: `${p.name} — ${p.fee}` }))}
          />
          <Input
            label="Account identifier"
            placeholder="Mobile number, IBAN or wallet ID"
            value={draftIdentifier}
            onChange={(e) => setDraftIdentifier(e.target.value)}
            hint="Double-check before saving — mistyped identifiers are the #1 cause of failed transfers."
          />
        </div>
      </Modal>
    </PageWrap>
  );
}
