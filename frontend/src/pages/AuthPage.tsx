import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'member'])
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function AuthPage() {
  const isSignup = useLocation().pathname.includes('signup');
  const navigate = useNavigate();
  const { login, signup, loading } = useAuthStore();
  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginForm | SignupForm>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: isSignup ? { role: 'member' } : { email: 'admin@taskflow.app', password: 'Password123!' }
  });

  const submit = handleSubmit(async (values) => {
    try {
      if (isSignup) await signup(values as SignupForm);
      else await login(values as LoginForm);
      toast.success(isSignup ? 'Workspace created' : 'Welcome back');
      navigate('/dashboard');
    } catch (error: any) {
      const fieldErrors = error.response?.data?.details?.fieldErrors;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          setError(field as keyof (LoginForm | SignupForm), { message: (messages as string[])[0] });
        });
      }
    }
  });

  return (
    <div className="grid min-h-screen place-items-center p-4 text-white">
      <AnimatedBackground />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow backdrop-blur-2xl md:grid-cols-[.95fr_1.05fr]">
        <div className="hidden bg-gradient-to-br from-cyan-300/20 via-violet-500/10 to-emerald-300/10 p-10 md:block">
          <Link to="/" className="flex items-center gap-2 font-extrabold"><Sparkles className="text-cyan-300" /> TaskFlow</Link>
          <div className="mt-24">
            <ShieldCheck className="mb-5 h-12 w-12 text-cyan-200" />
            <h1 className="text-4xl font-black leading-tight">Secure team execution with a calmer command center.</h1>
            <p className="mt-5 leading-7 text-slate-300">JWT auth, role-aware workflows, realtime updates, and a polished dark interface ready for demos and deployment.</p>
          </div>
        </div>
        <form onSubmit={submit} className="p-6 sm:p-10">
          <h2 className="text-3xl font-black">{isSignup ? 'Create your workspace' : 'Welcome back'}</h2>
          <p className="mt-2 text-sm text-slate-400">{isSignup ? 'Start with a clean, animated team workspace.' : 'Demo: admin@taskflow.app / Password123!'}</p>
          <div className="mt-8 space-y-4">
            {isSignup && <Field error={(errors as any).name?.message}><Input placeholder="Full name" {...register('name' as any)} /></Field>}
            <Field error={errors.email?.message}><Input placeholder="Email address" type="email" {...register('email')} /></Field>
            <Field error={errors.password?.message} hint={isSignup ? 'Password must be 8 or more characters.' : undefined}>
              <Input placeholder="Password" type="password" {...register('password')} />
            </Field>
            {isSignup && <Select {...register('role' as any)}><option value="member">Member</option><option value="admin">Admin</option></Select>}
          </div>
          <Button className="mt-6 w-full" disabled={loading}>{isSignup ? 'Create account' : 'Login'}</Button>
          <p className="mt-5 text-center text-sm text-slate-400">
            {isSignup ? 'Already have an account?' : 'Need an account?'} <Link className="text-cyan-200" to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Login' : 'Sign up'}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ children, error, hint }: { children: ReactNode; error?: string; hint?: string }) {
  return (
    <label className="block">
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-300">{error}</span> : hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
