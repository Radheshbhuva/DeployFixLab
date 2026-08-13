import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'engineer@deployfix.lab',
      password: 'Password123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await authService.login(data.email, data.password);
      setUser(res.user, res.accessToken);
      toast.success(`Welcome back, ${res.user.fullName}!`);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-brand-primary mb-3 shadow-lg shadow-blue-950/40">
          <Terminal className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">
          DeployFix Lab
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Sign in to your engineering workspace
        </p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 rounded-md bg-status-danger-dim border border-status-danger text-status-danger text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="engineer@company.com"
          error={errors.email?.message}
          register={register('email')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            register={register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-text-muted hover:text-text-primary focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button variant="primary" type="submit" isLoading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border-default text-center text-xs text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-primary hover:underline font-semibold">
          Register
        </Link>
      </div>
    </AuthLayout>
  );
};
