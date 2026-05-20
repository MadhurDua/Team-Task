import { useState } from 'react';
import type { FormEvent } from 'react';
import { Camera, Moon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PageTransition } from '../components/PageTransition';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [form, setForm] = useState({ name: user?.name || '', title: user?.title || '', avatar: user?.avatar || '' });

  async function save(event: FormEvent) {
    event.preventDefault();
    const { data } = await api.patch('/users/me', form);
    setUser(data.data);
    toast.success('Profile updated');
  }

  return (
    <PageTransition>
      <div className="mb-8"><p className="text-sm text-cyan-200">Workspace preferences</p><h1 className="mt-2 text-4xl font-black">Profile & Settings</h1></div>
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <section className="glass rounded-2xl p-6 text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-3xl font-black text-ink">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <Button className="mt-5" variant="ghost" icon={<Camera size={16} />}>Avatar upload</Button>
          <p className="mt-4 text-sm text-slate-400">Paste an avatar URL below or connect storage for production uploads.</p>
        </section>
        <form onSubmit={save} className="glass rounded-2xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-400">Name<Input className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="block text-sm text-slate-400">Title<Input className="mt-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          </div>
          <label className="mt-4 block text-sm text-slate-400">Avatar URL<Input className="mt-2" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} /></label>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 font-semibold"><Moon size={18} /> Dark mode</span><span className="rounded-full bg-emerald-300/15 px-3 py-1 text-sm text-emerald-200">Default</span></div>
          </div>
          <Button className="mt-6" icon={<Save size={16} />}>Save changes</Button>
        </form>
      </div>
    </PageTransition>
  );
}
