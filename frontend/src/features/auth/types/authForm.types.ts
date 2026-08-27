export type UserAuthRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';


export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  role: UserAuthRole;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface PasswordCriterion {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

export interface PasswordEvaluationResult {
  criteria: PasswordCriterion[];
  score: number; // 0 to 4
  percentage: number; // 0 to 100
  label: 'Weak' | 'Fair' | 'Good' | 'Strong & Secure';
  color: string;
  isValid: boolean;
}

export interface DemoAccountPreset {
  roleName: string;
  email: string;
  password: string;
  badge: string;
  badgeColor: string;
}
