import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageTransition } from '../components/PageTransition';
import { Skeleton } from '../components/Skeleton';
import { useWorkspaceStore } from '../store/workspaceStore';
import { formatDate } from '../lib/utils';

export function DashboardPage() {
  const { dashboard, fetchDashboard, loading } = useWorkspaceStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = [
    { label: 'Total tasks', value: dashboard?.stats.totalTasks || 0, icon: ListTodo, tone: 'text-cyan-200' },
    { label: 'Completed', value: dashboard?.stats.completedTasks || 0, icon: CheckCircle2, tone: 'text-emerald-200' },
    { label: 'Pending', value: dashboard?.stats.pendingTasks || 0, icon: Clock3, tone: 'text-violet-200' },
    { label: 'Overdue', value: dashboard?.stats.overdueTasks || 0, icon: AlertTriangle, tone: 'text-rose-200' }
  ];

  return (
    <PageTransition>
      <div className="mb-8">
        <p className="text-sm text-cyan-200">Executive workspace</p>
        <h1 className="mt-2 text-4xl font-black">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.09, duration: 0.42, ease: [0.22, 1, 0.36, 1] }} className="glass rounded-2xl p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{stat.label}</p><stat.icon className={stat.tone} /></div><AnimatedNumber value={stat.value} /></motion.div>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="glass rounded-2xl p-5">
          <h2 className="text-xl font-bold">Productivity</h2>
          <div className="mt-5 h-80">
            {loading && !dashboard ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard?.productivity || []}>
                  <defs><linearGradient id="taskflow" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} /></linearGradient></defs>
                  <CartesianGrid stroke="rgba(255,255,255,.08)" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="completed" stroke="#22d3ee" fill="url(#taskflow)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="text-xl font-bold">Recent activity</h2>
          <div className="mt-5 space-y-3">
            {(dashboard?.activity || []).map((task) => (
              <div key={task._id} className="rounded-xl bg-white/[0.05] p-4">
                <p className="font-semibold">{task.title}</p>
                <p className="mt-1 text-sm text-slate-400">{typeof task.project !== 'string' ? task.project.name : 'Project'} • {formatDate(task.updatedAt)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6">
        <h2 className="mb-4 text-xl font-bold">Recent projects</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(dashboard?.projects || []).map((project) => <div key={project._id} className="glass rounded-2xl p-5"><div className="mb-4 h-2 rounded-full" style={{ background: project.color }} /><h3 className="text-lg font-bold">{project.name}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-400">{project.description}</p><p className="mt-4 text-xs text-slate-500">{project.members.length} members • due {formatDate(project.dueDate)}</p></div>)}
        </div>
      </section>
    </PageTransition>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  return <motion.p className="mt-4 text-4xl font-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{value}</motion.p>;
}
