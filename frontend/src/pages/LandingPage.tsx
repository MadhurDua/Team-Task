import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BellRing, ChartNoAxesCombined, Kanban, Lock, Sparkles, Users } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';

const features = [
  { icon: Kanban, title: 'Live Kanban', body: 'Drag priorities across teams with realtime task updates and optimistic movement.' },
  { icon: ChartNoAxesCombined, title: 'Signal-rich analytics', body: 'Track throughput, overdue work, completion velocity, and team momentum.' },
  { icon: Lock, title: 'Role-aware control', body: 'Admins manage projects and assignments while members focus on their owned work.' },
  { icon: BellRing, title: 'Notifications', body: 'Socket-powered alerts keep comments, invites, and task changes visible.' }
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden text-white">
      <AnimatedBackground />
      <nav className="fixed left-4 right-4 top-4 z-20 mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2 font-extrabold"><Sparkles className="text-cyan-300" /> TaskFlow</Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Login</Link>
          <Link to="/signup"><Button>Start free</Button></Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 pb-20 pt-28 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
            <Sparkles size={15} /> Built for fast-moving product teams
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">TaskFlow</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A modern team command center for projects, Kanban execution, realtime collaboration, and executive-ready analytics.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup"><Button icon={<ArrowRight size={18} />}>Create workspace</Button></Link>
            <Link to="/login"><Button variant="ghost">View demo</Button></Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className="glass relative rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Launch Command</p>
              <h2 className="text-2xl font-bold">Sprint health</h2>
            </div>
            <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm text-emerald-200">Live</span>
          </div>
          <div className="grid gap-3">
            {['Design QA', 'API hardening', 'Mobile Kanban'].map((task, index) => (
              <motion.div key={task} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.1 }} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{task}</span>
                  <span className="text-sm text-cyan-200">{index === 0 ? 'Done' : index === 1 ? 'In progress' : 'Today'}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${90 - index * 22}%` }} /></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => <motion.div key={feature.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass rounded-2xl p-5"><feature.icon className="mb-4 text-cyan-300" /><h3 className="font-bold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{feature.body}</p></motion.div>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-28">
        <div className="glass rounded-2xl p-8 text-center">
          <Users className="mx-auto mb-4 text-violet-300" />
          <p className="mx-auto max-w-3xl text-2xl font-bold leading-10">“TaskFlow feels like the operating layer we wished our product, design, and engineering teams already had.”</p>
          <p className="mt-4 text-sm text-slate-400">Avery Chen, Product Lead</p>
        </div>
      </section>
    </div>
  );
}
