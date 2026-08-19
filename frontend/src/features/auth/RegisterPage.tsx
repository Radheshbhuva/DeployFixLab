import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
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
      .enum(['STUDENT', 'SRE', 'INSTRUCTOR'])
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
  const toast = useToast();

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
      const res = await authService.register(data.email, data.password, data.fullName);
      setUser(res.user, res.accessToken);
      toast.success('Account created successfully! Welcome to DeployFix Lab.');
      navigate('/dashboard', { replace: true });
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
      <div className="lg:hidden flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 mb-2 shadow-md">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-bold text-lg text-slate-100">
          DeployFix <span className="text-cyan-400 font-mono">Lab</span>
        </span>
      </div>

      {/* Header */}
      <div className="text-left mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
          Start diagnosing broken deployments in sandboxed containers.
        </p>
      </div>

      {/* API Error Alert Banner */}
      {apiError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed font-mono">{apiError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        {/* Role Selector Pills */}
        <RoleSelectorPills
          selectedRole={selectedRole}
          onSelectRole={handleRoleChange}
        />

        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-slate-300">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Alex Johnson"
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
              <span>● {errors.fullName.message}</span>
            </p>
          )}
        </div>

        {/* Email Address Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-slate-300">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            placeholder="alex@company.com"
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
              <span>● {errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-slate-300">
            Create Password <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full px-4 py-3 pr-11 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 focus:outline-none p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
              <span>● {errors.password.message}</span>
            </p>
          )}

          {/* Dynamic Password Strength Bar & Criteria Checklist */}
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-slate-300">
            Confirm Password <span className="text-rose-400">*</span>
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.confirmPassword
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-800 focus:border-cyan-500/60 focus:ring-cyan-500/20'
            }`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-mono">
              <span>● {errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="termsAccepted"
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500/20"
            {...register('termsAccepted')}
          />
          <label htmlFor="termsAccepted" className="text-xs text-slate-400 leading-snug cursor-pointer select-none">
            I agree to the{' '}
            <a href="#privacy" className="text-cyan-400 hover:underline">
              Zero-Secret Security Policy
            </a>{' '}
            and terms of service.
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-xs text-rose-400 flex items-center gap-1 font-mono">
            <span>● {errors.termsAccepted.message}</span>
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account & Launch Lab</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:underline font-mono font-semibold">
          Sign In to Workspace →
        </Link>
      </div>
    </AuthLayout>
  );
};
