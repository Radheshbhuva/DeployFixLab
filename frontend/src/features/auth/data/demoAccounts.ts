import { DemoAccountPreset } from '../types/authForm.types';

export const DEMO_ACCOUNTS: DemoAccountPreset[] = [
  {
    roleName: 'Lead SRE',
    email: 'engineer@deployfix.lab',
    password: 'Password123!',
    badge: 'DEFAULT',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  {
    roleName: 'DevOps Student',
    email: 'student@deployfix.lab',
    password: 'Password123!',
    badge: 'STUDENT',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    roleName: 'Lab Instructor',
    email: 'instructor@deployfix.lab',
    password: 'Password123!',
    badge: 'INSTRUCTOR',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  }
];
