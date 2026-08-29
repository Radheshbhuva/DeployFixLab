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
import { PasswordStrengthMeter } from './components/PasswordStrengthMeter';
import { RoleSelectorPills } from './components/RoleSelectorPills';
import { RegisterFormData, UserAuthRole } from './types/authForm.types';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(64, 'Full name must be under 64 characters'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    role: z
      .enum(['STUDENT', 'INSTRUCTOR', 'ADMIN'])
      .default('STUDENT'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter (A-Z)')
      .regex(/[0-9]/, 'Must contain at least one number (0-9)')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special symbol (!@#$%^&*)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept the security terms to proceed'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const RegisterPage: React.FC = () => {
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'STUDENT',
      password: '',
      confirmPassword: '',
      termsAccepted: true,
    },
  });

  const passwordValue = watch('password');
  const selectedRole = watch('role') || 'STUDENT';

  const handleRoleChange = (role: UserAuthRole) => {
    setValue('role', role, { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await authService.register(data.email, data.password, data.fullName, data.role);
      setUser(res.user, res.accessToken);
      toast.success(`Account created successfully as ${res.user.role}! Welcome to DeployFix Lab.`);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Registration failed. An account with this email may already exist.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Mobile Branding */}
      <div className="lg:hidden flex flex-col items-center text-center mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 mb-1 shadow-md">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <span className="font-bold text-base text-slate-100">
          DeployFix <span className="text-cyan-400 font-mono">Lab</span>
        </span>
      </div>

      {/* Header */}
      <div className="text-left mb-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-50 tracking-tight">
          Create Account
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 leading-tight">
          Start diagnosing broken deployments in sandboxed containers.
        </p>
      </div>

      {/* API Error Alert Banner */}
      {apiError && (
        <div className="mb-2.5 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed font-mono">{apiError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 text-left">
        {/* Role Selector Pills */}
        <RoleSelectorPills
          selectedRole={selectedRole}
          onSelectRole={handleRoleChange}
        />

        {/* 2-Column: Full Name & Email Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Full Name Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-medium text-text-secondary">
              Full Name <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Alex Johnson"
              className={`w-full px-3 py-1.5 rounded-xl bg-bg-surface border text-text-primary placeholder-text-muted font-sans text-xs focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-status-danger/60 focus:border-status-danger focus:ring-status-danger/20'
                  : 'border-border-default focus:border-brand-primary/60 focus:ring-brand-primary/20'
              }`}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-[10px] text-status-danger flex items-center gap-1 mt-0.5 font-mono">
                <span>● {errors.fullName.message}</span>
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-medium text-text-secondary">
              Email Address <span className="text-status-danger">*</span>
            </label>
            <input
              type="email"
              placeholder="alex@company.com"
              className={`w-full px-3 py-1.5 rounded-xl bg-bg-surface border text-text-primary placeholder-text-muted font-sans text-xs focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-status-danger/60 focus:border-status-danger focus:ring-status-danger/20'
                  : 'border-border-default focus:border-brand-primary/60 focus:ring-brand-primary/20'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[10px] text-status-danger flex items-center gap-1 mt-0.5 font-mono">
                <span>● {errors.email.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* 2-Column: Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-medium text-text-secondary">
              Password <span className="text-status-danger">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className={`w-full px-3 py-1.5 pr-8 rounded-xl bg-bg-surface border text-text-primary placeholder-text-muted font-sans text-xs focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-status-danger/60 focus:border-status-danger focus:ring-status-danger/20'
                    : 'border-border-default focus:border-brand-primary/60 focus:ring-brand-primary/20'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-status-danger flex items-center gap-1 mt-0.5 font-mono">
                <span>● {errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-medium text-text-secondary">
              Confirm Password <span className="text-status-danger">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full px-3 py-1.5 rounded-xl bg-bg-surface border text-text-primary placeholder-text-muted font-sans text-xs focus:outline-none focus:ring-2 transition-all ${
                errors.confirmPassword
                  ? 'border-status-danger/60 focus:border-status-danger focus:ring-status-danger/20'
                  : 'border-border-default focus:border-brand-primary/60 focus:ring-brand-primary/20'
              }`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-[10px] text-status-danger flex items-center gap-1 mt-0.5 font-mono">
                <span>● {errors.confirmPassword.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* Live Password Strength Meter */}
        <PasswordStrengthMeter password={passwordValue || ''} />

        {/* Terms and Privacy Checkbox */}
        <div className="flex items-start gap-2 pt-0.5">
          <input
            id="termsAccepted"
            type="checkbox"
            className="w-3.5 h-3.5 rounded bg-bg-surface border-border-default text-brand-primary focus:ring-brand-primary/20 mt-0.5"
            {...register('termsAccepted')}
          />
          <label htmlFor="termsAccepted" className="text-[11px] font-mono text-text-secondary leading-tight select-none">
            I accept the{' '}
            <a href="#terms" className="text-brand-primary hover:underline">
              Security Terms
            </a>{' '}
            & Zero-Telemetry Agreement
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-[10px] text-status-danger flex items-center gap-1 font-mono">
            <span>● {errors.termsAccepted.message}</span>
          </p>
        )}

        {/* Create Account Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold font-mono text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Free Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline font-mono font-semibold">
          Sign In to Workspace →
        </Link>
      </div>
    </AuthLayout>
  );
};
