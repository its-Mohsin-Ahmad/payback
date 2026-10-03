import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  DemoBanner,
  Input,
  Modal,
  PageHeader,
  Select,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui';
import { businessProfile, teamMembers } from '@/data/enterprise';

export default function BusinessTeamPage() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Maker');

  const active = teamMembers.filter((m) => m.status === 'Active').length;
  const invited = teamMembers.filter((m) => m.status === 'Invited').length;

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Manage"
        title="Team & permissions"
        description="Who can make, approve and view — with least-privilege by default."
        actions={
          <Button icon={<UserPlus className="h-4 w-4" aria-hidden />} onClick={() => setOpen(true)}>
            Invite member
          </Button>
        }
      />

      <DemoBanner label="Demo team" text="Members and emails are synthetic — invitations are not actually sent." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active members" value={String(active)} tone="#10B981" footer={`${businessProfile.employees} employees in total`} />
        <StatCard label="Pending invites" value={String(invited)} tone="#F59E0B" />
        <StatCard label="Approvers" value={String(teamMembers.filter((m) => m.permission === 'Approver' || m.permission === 'Administrator').length)} tone="#38BDF8" footer="Required for dual control" />
      </div>

      <Card>
        <CardHeader title="Members" subtitle={`${teamMembers.length} people with access`} />
        <TableWrap>
          <thead>
            <tr>
              <Th>Member</Th>
              <Th className="hidden md:table-cell">Role</Th>
              <Th>Permission</Th>
              <Th className="hidden lg:table-cell">Email</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <Tr key={member.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={member.name} size="sm" color="#0F172A" />
                    <span className="font-semibold text-slate-900">{member.name}</span>
                  </div>
                </Td>
                <Td className="hidden md:table-cell text-xs">{member.role}</Td>
                <Td>
                  <Badge tone={member.permission === 'Administrator' ? 'navy' : member.permission === 'Approver' ? 'emerald' : member.permission === 'Maker' ? 'sky' : 'neutral'}>
                    {member.permission}
                  </Badge>
                </Td>
                <Td className="hidden lg:table-cell text-xs text-slate-500">{member.email}</Td>
                <Td align="right">
                  <Badge tone={member.status === 'Active' ? 'emerald' : 'amber'}>{member.status}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Alert tone="info" title="Maker — Checker — Administrator">
        Makers create payments, Approvers release them, Administrators manage users and limits. One person can never both
        make and approve the same payment.
      </Alert>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a team member"
        description="They will receive an email invitation (simulated)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!name.trim() || !email.trim()) {
                  toast.error('Missing details', 'Enter a name and email address.');
                  return;
                }
                setOpen(false);
                setName('');
                setEmail('');
                toast.success('Invitation sent', `${name} was invited as ${role} (demo).`);
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" placeholder="e.g. Ayesha Noor" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Work email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select
            label="Permission"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'Maker', label: 'Maker — create payments' },
              { value: 'Approver', label: 'Approver — release payments' },
              { value: 'View only', label: 'View only — read-only access' },
              { value: 'Administrator', label: 'Administrator — full access' },
            ]}
          />
          <Alert tone="warning" title="Least privilege">
            Only give Administrator to people who genuinely need to manage users and limits.
          </Alert>
        </div>
      </Modal>
    </PageWrap>
  );
}
