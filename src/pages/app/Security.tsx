import { useState } from 'react';
import { KeyRound, LogOut, Monitor, ShieldCheck } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import { ProgressRing } from '@/components/charts';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DemoBanner,
  Modal,
  PageHeader,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Toggle,
  Tr,
  useToast,
} from '@/components/ui';
import { loginActivity, securityAlerts, securityScore, securitySessions } from '@/data/mock';

export default function SecurityPage() {
  const toast = useToast();
  const [pwOpen, setPwOpen] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [sessions, setSessions] = useState(securitySessions);

  const signOut = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success('Session ended', 'That device has been signed out (demo).');
  };

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Account"
        title="Security centre"
        description="Everything that protects your money — score, controls and activity."
        actions={
          <Button icon={<KeyRound className="h-4 w-4" aria-hidden />} onClick={() => setPwOpen(true)}>
            Change password
          </Button>
        }
      />

      <DemoBanner label="Demo security" text="Sessions, alerts and activity below are synthetic examples." />

      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-6">
            <ProgressRing value={securityScore.score} size={140} label={String(securityScore.score)} sublabel="/ 100" tone="#10B981" />
            <Badge tone="emerald">{securityScore.label}</Badge>
            <p className="text-center text-xs text-slate-500">
              Your account is well protected. Complete the remaining check to reach 100.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Security checks" subtitle={`${securityScore.checks.filter((c) => c.done).length} of ${securityScore.checks.length} complete`} />
          <CardBody className="space-y-3">
            {securityScore.checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-700">
                  <ShieldCheck className={`h-4 w-4 ${check.done ? 'text-emerald-500' : 'text-slate-300'}`} aria-hidden />
                  {check.label}
                </div>
                {check.done ? <Badge tone="emerald">Done</Badge> : (
                  <Button size="xs" variant="soft" onClick={() => toast.info('Demo', 'Verification flow is simulated.')}>
                    Fix now
                  </Button>
                )}
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Protection controls" />
          <CardBody className="space-y-4">
            <Toggle checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" hint="Required for transfers above $2,000" />
            <Toggle checked={biometrics} onChange={setBiometrics} label="Biometric sign-in" hint="Face / fingerprint on supported devices" />
            <Toggle checked={alerts} onChange={setAlerts} label="Real-time transaction alerts" hint="Push + email for every movement" />
            {twoFactor && biometrics && alerts ? (
              <Alert tone="success" title="All core protections enabled">Great — keep your recovery codes somewhere safe.</Alert>
            ) : (
              <Alert tone="warning" title="Some protections are off">Enable everything above to maximise your score.</Alert>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Active sessions" subtitle={`${sessions.length} devices signed in`} />
          <CardBody className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Monitor className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{session.device}</p>
                    {session.current ? <Badge tone="emerald">This device</Badge> : null}
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {session.location} • {session.lastActive} • {session.ip}
                  </p>
                </div>
                {!session.current ? (
                  <Button size="xs" variant="outline" icon={<LogOut className="h-3.5 w-3.5" aria-hidden />} onClick={() => signOut(session.id)}>
                    End
                  </Button>
                ) : null}
              </div>
            ))}
            {sessions.length === 0 ? <p className="py-4 text-center text-sm text-slate-400">No other sessions.</p> : null}
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Login activity" subtitle="Recent authentication events" />
          <TableWrap>
            <thead>
              <tr>
                <Th>Event</Th>
                <Th className="hidden md:table-cell">Device</Th>
                <Th className="hidden lg:table-cell">Time</Th>
                <Th align="right">Result</Th>
              </tr>
            </thead>
            <tbody>
              {loginActivity.map((row) => (
                <Tr key={row.id}>
                  <Td>
                    <p className="font-semibold text-slate-900">{row.action}</p>
                    <p className="text-xs text-slate-500">{row.location}</p>
                  </Td>
                  <Td className="hidden text-xs md:table-cell">{row.device}</Td>
                  <Td className="hidden text-xs text-slate-500 lg:table-cell">{row.time}</Td>
                  <Td align="right">
                    <StatusBadge status={row.result === 'Success' ? 'Completed' : 'Blocked'} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        <Card>
          <CardHeader title="Security alerts" subtitle="Things we noticed for you" />
          <CardBody className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-100 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                  <Badge tone={alert.level === 'Resolved' ? 'emerald' : 'amber'}>{alert.level}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{alert.detail}</p>
                <p className="mt-1 text-[11px] text-slate-400">{alert.time}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </section>

      <Alert tone="info" title="If something looks wrong">
        End all sessions, change your password and freeze affected cards immediately. Our fraud team monitors every demo
        account around the clock (simulated).
      </Alert>

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        title="Change password"
        description="Use at least 12 characters with a mix of letters, numbers and symbols."
        footer={
          <>
            <Button variant="ghost" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPwOpen(false);
                toast.success('Password updated', 'All other sessions were signed out (demo).');
              }}
            >
              Update password
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <input type="password" placeholder="Current password" className="focus-ring min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <input type="password" placeholder="New password" className="focus-ring min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <input type="password" placeholder="Confirm new password" className="focus-ring min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <Alert tone="warning" title="Demo only">No password is stored — this form validates locally and resets.</Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}
