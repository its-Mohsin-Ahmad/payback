import { useState } from 'react';
import { Moon, Save, Sun } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  PageHeader,
  Select,
  Toggle,
  useToast,
} from '@/components/ui';
import { accounts } from '@/data/mock';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const toast = useToast();
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('mdy');
  const [theme, setTheme] = useState<Theme>('light');
  const [defaultAccount, setDefaultAccount] = useState(accounts[0].id);
  const [confirmLarge, setConfirmLarge] = useState(true);
  const [hideOnBlur, setHideOnBlur] = useState(true);
  const [profileDiscoverable, setProfileDiscoverable] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Personalise how PAYBACK looks, behaves and talks to you."
        actions={
          <Button icon={<Save className="h-4 w-4" aria-hidden />} onClick={() => toast.success('Settings saved', 'Your preferences were updated (demo).')}>
            Save changes
          </Button>
        }
      />

      <DemoBanner label="Demo preferences" text="Preferences reset when you reload the prototype." />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Appearance & language" />
          <CardBody className="space-y-4">
            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: 'en', label: 'English (UK/US)' },
                { value: 'ur', label: 'اردو (Urdu)' },
                { value: 'ar', label: 'العربية (Arabic)' },
              ]}
            />
            <Select
              label="Date format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              options={[
                { value: 'mdy', label: '25 Apr 2025 (Day first)' },
                { value: 'ymd', label: '2025-04-25 (ISO)' },
                { value: 'dmy', label: '25/04/2025' },
              ]}
            />
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">Theme</p>
              <div className="flex gap-2">
                {([
                  { key: 'light', label: 'Light', icon: <Sun className="h-4 w-4" aria-hidden /> },
                  { key: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" aria-hidden /> },
                  { key: 'system', label: 'System', icon: null },
                ] as const).map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setTheme(option.key)}
                    className={cn(
                      'focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors',
                      theme === option.key
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">Dark mode ships in the next demo iteration.</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Transfer defaults" subtitle="Applies to new payments" />
          <CardBody className="space-y-4">
            <Select
              label="Default funding account"
              value={defaultAccount}
              onChange={(e) => setDefaultAccount(e.target.value)}
              options={accounts.map((a) => ({ value: a.id, label: `${a.name} •••• ${a.number}` }))}
            />
            <Toggle checked={confirmLarge} onChange={setConfirmLarge} label="Confirm large transfers" hint="Extra verification above $2,000" />
            <Toggle checked={hideOnBlur} onChange={setHideOnBlur} label="Hide balances when switching apps" hint="Privacy screen on app switch" />
            <Alert tone="info" title="Defaults apply instantly">
              You can still override the funding account on every payment.
            </Alert>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Privacy" subtitle="Control what others can see" />
          <CardBody className="space-y-4">
            <Toggle checked={profileDiscoverable} onChange={setProfileDiscoverable} label="Discoverable by PAYBACK ID" hint="Friends can find you to send money" />
            <Toggle checked={shareAnalytics} onChange={setShareAnalytics} label="Share anonymous usage analytics" hint="Helps improve the product" />
            <Button variant="outline" block onClick={() => toast.info('Data export', 'A machine-readable export would be emailed (demo).')}>
              Download my data
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Session & reset" subtitle="Control this device" />
          <CardBody className="space-y-3">
            <Button variant="outline" block onClick={() => toast.success('Signed out', 'All sessions except this one were ended (demo).')}>
              Sign out everywhere else
            </Button>
            <Button variant="danger" block onClick={() => toast.warning('Reset simulated', 'Prototype state would be wiped in a real build.')}>
              Reset app preferences
            </Button>
            <Alert tone="warning" title="Resetting does not touch balances">
              Preference resets only affect appearance and notification settings in this demo.
            </Alert>
          </CardBody>
        </Card>
      </section>

      <p className="pb-2 text-center text-xs text-slate-400">
        PAYBACK prototype • settings are stored in memory only and reload with the page.
      </p>
    </PageWrap>
  );
}
