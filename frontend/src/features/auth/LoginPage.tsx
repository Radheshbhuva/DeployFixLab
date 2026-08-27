import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, ArrowRight, Loader2, Zap } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { DemoCredentialsBanner } from './components/DemoCredentialsBanner';
import { DemoAccountPreset, LoginFormData } from './types/authForm.types';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    searchParams.get('redirect') ||
    '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@deployfix.lab',
      password: 'Password123!',
      rememberMe: true,
    },
  });

  const handleSelectDemoPreset = (preset: DemoAccountPreset) => {
    setValue('email', preset.email, { shouldValidate: true });
    setValue('password', preset.password, { shouldValidate: true });
    setApiError(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await authService.login(data.email, data.password);
      setUser(res.user, res.accessToken);
      toast.success(`Welcome back, ${res.user.fullName || 'Engineer'}!`);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Invalid credentials. Please verify your email and password.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Mobile Branding */}
      <div className="lg:hidden flex flex-col items-center text-center mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 mb-1 shadow-md">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <span className="font-bold text-base text-slate-100">
          DeployFix <span className="text-cyan-400 font-mono">Lab</span>
        </span>
      </div>

      {/* Header */}
      <div className="text-left mb-3">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 leading-tight">
          Sign in to access your incident diagnostics and chaos sandboxes.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Toolbar */}
      <DemoCredentialsBanner onSelectPreset={handleSelectDemoPreset} />

      {/* API Error Alert Banner */}
      {apiError && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed font-mono">{apiError}</span>
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-left mt-2">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-xs font-mono font-medium text-slate-300">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            placeholder="engineer@company.com"
            className={`w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5 font-mono">
              <span>● {errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Password <span className="text-rose-400">*</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert('For local lab accounts, use the demo credentials above.');
              }}
              className="text-[11px] font-mono text-cyan-400 hover:underline"
            >
              Forgot?
            </a>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full px-3.5 py-2 pr-10 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 focus:outline-none p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5 font-mono">
              <span>● {errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2 pt-0.5">
          <input
            id="rememberMe"
            type="checkbox"
            className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/20"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="text-[11px] font-mono text-slate-400 cursor-pointer select-none">
            Keep me signed in for 7 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-cyan-400 hover:underline font-mono font-semibold">
          Create an Account Free →
        </Link>
      </div>
    </AuthLayout>
  );
};
