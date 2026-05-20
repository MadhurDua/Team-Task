import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { PageTransition } from '../components/PageTransition';
import { Select } from '../components/Select';
import { Skeleton } from '../components/Skeleton';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { getData } from '../services/api';
import type { Project, Task } from '../lib/types';
import { formatDate } from '../lib/utils';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ project: Project; tasks: Task[] }>();
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({ email: '', role: 'contributor' });
  const [addingMember, setAddingMember] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (id) getData<{ project: Project; tasks: Task[] }>(`/projects/${id}`).then(setData);
  }, [id]);

  if (!data) return <PageTransition><Skeleton className="h-[520px]" /></PageTransition>;

  const done = data.tasks.filter((task) => task.status === 'completed').length;
  const progress = data.tasks.length ? Math.round((done / data.tasks.length) * 100) : 0;

  async function addMember(event: React.FormEvent) {
    event.preventDefault();
    if (!id) return;

    setAddingMember(true);
    try {
      const { data: response } = await api.post(`/projects/${id}/members`, memberForm);
      setData((current) => (current ? { ...current, project: response.data } : current));
      setMemberForm({ email: '', role: 'contributor' });
      setMemberModalOpen(false);
      toast.success('Member added to project');
    } finally {
      setAddingMember(false);
    }
  }

  return (
    <PageTransition>
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm capitalize text-cyan-200">{data.project.priority} priority</p>
            <h1 className="mt-2 text-4xl font-black">{data.project.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-300">{data.project.description}</p>
          </div>
          <div className="rounded-xl bg-white/[0.06] p-4 text-right"><p className="text-sm text-slate-400">Due</p><p className="font-bold">{formatDate(data.project.dueDate)}</p></div>
        </div>
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm"><span>Progress</span><span>{progress}%</span></div>
          <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${progress}%` }} /></div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.75fr_1.25fr]">
        <section className="glass rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-xl font-bold"><Users /> Members</h2>
            {user?.role === 'admin' && <Button variant="ghost" icon={<Plus size={16} />} onClick={() => setMemberModalOpen(true)}>Add</Button>}
          </div>
          <div className="space-y-3">
            {data.project.members.map((member) => <div key={member.user._id} className="flex items-center gap-3 rounded-xl bg-white/[0.05] p-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-cyan-300 text-ink font-bold">{member.user.name.slice(0, 2)}</div><div><p className="font-semibold">{member.user.name}</p><p className="text-xs text-slate-400">{member.role}</p></div></div>)}
          </div>
          {user?.role !== 'admin' && <p className="mt-4 text-sm text-slate-500">Only admins can add or manage project members.</p>}
        </section>
        <section className="glass rounded-2xl p-5">
          <h2 className="mb-4 text-xl font-bold">Tasks</h2>
          <div className="space-y-3">
            {data.tasks.map((task) => <div key={task._id} className="rounded-xl bg-white/[0.05] p-4"><div className="flex justify-between gap-3"><p className="font-semibold">{task.title}</p><span className="text-sm capitalize text-slate-400">{task.status}</span></div><p className="mt-1 text-sm text-slate-500">{task.assignee?.name || 'Unassigned'} • {formatDate(task.dueDate)}</p></div>)}
          </div>
        </section>
      </div>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold"><MessageSquare /> Activity timeline</h2>
        {(data.project.activity || []).map((item, index) => <div key={`${item.createdAt}-${index}`} className="border-l border-white/10 pb-4 pl-4"><p className="font-medium">{item.message}</p><p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p></div>)}
      </section>

      <Modal open={memberModalOpen} title="Add project member" onClose={() => setMemberModalOpen(false)}>
        <form onSubmit={addMember} className="space-y-4">
          <div>
            <Input
              required
              type="email"
              placeholder="Member email"
              value={memberForm.email}
              onChange={(event) => setMemberForm({ ...memberForm, email: event.target.value })}
            />
            <p className="mt-2 text-xs text-slate-500">The person must already have an account. Ask them to sign up first if they are not registered.</p>
          </div>
          <Select value={memberForm.role} onChange={(event) => setMemberForm({ ...memberForm, role: event.target.value })}>
            <option value="contributor">Contributor</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </Select>
          <Button className="w-full" disabled={addingMember}>{addingMember ? 'Adding member...' : 'Add member'}</Button>
        </form>
      </Modal>
    </PageTransition>
  );
}
