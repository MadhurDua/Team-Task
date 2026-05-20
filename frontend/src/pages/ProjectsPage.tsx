import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LockKeyhole, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { PageTransition } from '../components/PageTransition';
import { Select } from '../components/Select';
import { useAuthStore } from '../store/authStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { formatDate } from '../lib/utils';

const schema = z.object({ name: z.string().min(2), description: z.string().optional(), priority: z.enum(['low', 'medium', 'high', 'urgent']), dueDate: z.string().optional(), color: z.string().optional() });
type FormValues = z.infer<typeof schema>;

export function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const { projects, fetchProjects, createProject } = useWorkspaceStore();
  const user = useAuthStore((state) => state.user);
  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { priority: 'medium', color: '#22d3ee' } });

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const submit = handleSubmit(async (values) => {
    await createProject(values as any);
    toast.success('Project created');
    reset();
    setOpen(false);
  });

  return (
    <PageTransition>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-cyan-200">Portfolio</p><h1 className="mt-2 text-4xl font-black">Projects</h1></div>
        {user?.role === 'admin' && <Button icon={<Plus size={17} />} onClick={() => setOpen(true)}>Create project</Button>}
      </div>
      {user?.role !== 'admin' && (
        <div className="glass mb-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-300/15 text-cyan-200">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h2 className="font-bold">Member access</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">Members can view assigned projects, update task status, and comment. Project creation is admin-only. Use `admin@taskflow.app` / `Password123!` to test admin workflows.</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Link to={`/projects/${project._id}`} key={project._id} className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:border-cyan-300/30" style={{ transitionDelay: `${index * 20}ms` }}>
            <div className="mb-5 flex items-center justify-between"><div className="h-10 w-10 rounded-xl" style={{ background: project.color }} /><span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">{project.priority}</span></div>
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{project.description}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{project.members.length} members</span><span>{formatDate(project.dueDate)}</span></div>
          </Link>
        ))}
      </div>

      <Modal open={open} title="Create project" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Project name" {...register('name')} />
          <Input placeholder="Description" {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-2"><Select {...register('priority')}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></Select><Input type="date" {...register('dueDate')} /></div>
          <Input type="color" className="h-12 p-1" {...register('color')} />
          <Button className="w-full">Save project</Button>
        </form>
      </Modal>
    </PageTransition>
  );
}
