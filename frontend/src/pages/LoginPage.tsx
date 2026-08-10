import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockAuthService } from '@/services/mockApi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('alex.mercer@deployfix.io');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const res = await mockAuthService.login(email);
      login(res.user, res.token);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError('Authentication failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100">Sign In to Workspace</h2>
        <p className="text-xs text-slate-400 mt-1">Access task dashboard & troubleshooting lab suite</p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="engineer@deployfix.io"
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-0" />
            Remember session
          </label>
          <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-400 hover:underline">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-400 font-semibold hover:underline">
          Register new user
        </Link>
      </div>

      {/* Demo Credentials Box */}
      <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Demo Mode Quick Credentials:
        </div>
        <div>Admin: <code className="text-blue-300">alex.mercer@deployfix.io</code> (Pass: Password123!)</div>
      </div>
    </div>
  );
};
