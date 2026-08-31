import { DemoAccountPreset } from '../types/authForm.types';

export const DEMO_ACCOUNTS: DemoAccountPreset[] = [
  {
    roleName: 'Student',
    email: 'student@deployfix.lab',
    password: 'Password123!',
    badge: 'STUDENT',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  },
  {
    roleName: 'DevOps/SRE Engineer',
    email: 'instructor@deployfix.lab',
    password: 'Password123!',
    badge: 'DEVOPS_SRE',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  {
    roleName: 'Platform Admin',
    email: 'admin@deployfix.lab',
    password: 'Password123!',
    badge: 'ADMIN',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  },
];

