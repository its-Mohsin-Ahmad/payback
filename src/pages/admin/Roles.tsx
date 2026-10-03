import { UserCog, UserPlus } from 'lucide-react';
import { PageWrap } from '@/components/blocks';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
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
import { adminRoles } from '@/data/enterprise';

export default function AdminRolesPage() {
  const toast = useToast();
  const members = adminRoles.reduce((s, r) => s + r.members, 0);

  return (
    <PageWrap>
      <PageHeader
        eyebrow="Configuration"
        title="Roles & access"
        description="Role-based access control for internal teams."
        actions={
          <Button icon={<UserPlus className="h-4 w-4" aria-hidden />} onClick={() => toast.info('Create role', 'Role editor is simulated.')}>
            Create role
          </Button>
        }
      />

      <DemoBanner label="Demo access data" text="Roles and member counts are synthetic." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Roles configured" value={String(adminRoles.length)} tone="#10B981" />
        <StatCard label="Staff assigned" value={String(members)} tone="#38BDF8" footer="Across global and regional scopes" />
        <StatCard label="Privileged roles" value={String(adminRoles.filter((r) => r.scope === 'Global' && r.permissions.includes('Full')).length)} tone="#F59E0B" footer="Reviewed weekly" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader title={role.name} action={<Badge tone={role.scope === 'Global' ? 'navy' : 'sky'}>{role.scope}</Badge>} />
            <CardBody className="space-y-3">
              <p className="text-sm leading-relaxed text-slate-600">{role.permissions}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-500">Members</span>
                <span className="tnum font-bold text-slate-900">{role.members}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                block
                icon={<UserCog className="h-4 w-4" aria-hidden />}
                onClick={() => toast.info('Manage role', `${role.name} permissions opened (demo).`)}
              >
                Manage role
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      <Alert tone="info" title="Principle of least privilege">
        Roles are reviewed quarterly. Any change to a privileged role requires approval from a second Super Admin and is
        written to the audit log (demo policy).
      </Alert>

      <Card>
        <CardHeader title="Permission matrix" subtitle="What each role can do" />
        <TableWrap>
          <thead>
            <tr>
              <Th>Role</Th>
              <Th align="right">Members</Th>
              <Th>Permissions</Th>
              <Th align="right">Scope</Th>
            </tr>
          </thead>
          <tbody>
            {adminRoles.map((role) => (
              <Tr key={role.id}>
                <Td className="font-semibold text-slate-900">{role.name}</Td>
                <Td align="right" className="tnum">{role.members}</Td>
                <Td className="text-xs">{role.permissions}</Td>
                <Td align="right">
                  <Badge tone={role.scope === 'Global' ? 'navy' : 'sky'}>{role.scope}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>
    </PageWrap>
  );
}
