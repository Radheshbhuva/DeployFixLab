import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await authService.register(data.email, data.password, data.fullName);
      setUser(res.user, res.accessToken);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
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
          Create your engineering account
        </p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 rounded-md bg-status-danger-dim border border-status-danger text-status-danger text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="Full Name"
          type="text"
          placeholder="Alex Johnson"
          error={errors.fullName?.message}
          register={register('fullName')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="alex@company.com"
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
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          register={register('confirmPassword')}
        />

        <Button variant="primary" type="submit" isLoading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-border-default text-center text-xs text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-primary hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
