import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Bell, ChevronLeft, Kanban, LayoutDashboard, LogOut, Menu, Plus, Search, Settings, Sparkles } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { Button } from './Button';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: BarChart3 },
  { to: '/kanban', label: 'Kanban', icon: Kanban },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const sidebar = (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 280 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="glass fixed inset-y-4 left-4 z-40 hidden rounded-2xl p-4 lg:block"
    >
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-300 text-ink shadow-glow"><Sparkles size={20} /></span>
          {!collapsed && <span className="text-lg font-extrabold">TaskFlow</span>}
        </Link>
        <button aria-label="Collapse sidebar" className="rounded-lg p-2 hover:bg-white/10" onClick={() => setCollapsed((value) => !value)}>
          <ChevronLeft className={cn('transition', collapsed && 'rotate-180')} size={18} />
        </button>
      </div>

      <nav className="mt-8 space-y-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white', isActive && 'bg-white/12 text-white')}
          >
            <item.icon size={19} />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-2xl bg-white/[0.06] p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-sm font-bold text-ink">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />
      {sidebar}
      <header className="fixed left-4 right-4 top-4 z-30 rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-xl lg:left-[312px]">
        <div className="flex items-center justify-between gap-3">
          <button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
            <Search size={17} className="text-slate-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Search projects, tasks, people..." />
          </div>
          <Button icon={<Plus size={17} />} onClick={() => navigate('/projects')}>New</Button>
          <button aria-label="Notifications" className="rounded-xl border border-white/10 p-3 text-slate-200 hover:bg-white/10"><Bell size={18} /></button>
          <button aria-label="Log out" onClick={() => { logout(); navigate('/login'); }} className="rounded-xl border border-white/10 p-3 text-slate-200 hover:bg-white/10"><LogOut size={18} /></button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-md lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <motion.div className="glass h-full w-72 rounded-2xl p-4" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-6 flex items-center justify-between">
                <span className="font-extrabold">TaskFlow</span>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-white/10">Close</button>
              </div>
              {nav.map((item) => <NavLink key={item.to} onClick={() => setMobileOpen(false)} to={item.to} className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-slate-200 hover:bg-white/10"><item.icon size={18} />{item.label}</NavLink>)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-4 pb-10 pt-24 lg:ml-[312px] lg:pr-8">
        {children}
      </main>
    </div>
  );
}
