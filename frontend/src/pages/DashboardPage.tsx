import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useLabStore } from '@/store/labStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckSquare,
  FlaskConical,
  Activity,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Server,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const tasks = useTaskStore((state) => state.tasks);
  const labs = useLabStore((state) => state.labs);

  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;

  const verifiedLabs = labs.filter((l) => l.status === 'VERIFIED').length;

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            DevOps Task Manager • Dashboard Overview
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            Welcome back, {user?.name || 'Engineer'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            System status: Operational. Manage task backlogs, execute container troubleshooting labs, and review telemetry logs.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/tasks">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Task Board
            </Button>
          </Link>
          <Link to="/labs">
            <Button variant="outline" size="md">
              Browse Labs
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Tasks</p>
              <h4 className="text-2xl font-extrabold text-slate-100 mt-1">{tasks.length}</h4>
              <p className="text-[10px] text-blue-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Active Sprint Tasks
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <CheckSquare className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">In Progress</p>
              <h4 className="text-2xl font-extrabold text-amber-400 mt-1">{inProgressTasks}</h4>
              <p className="text-[10px] text-amber-400/80 font-medium mt-1">
                Requires Engineering Attention
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Completed</p>
              <h4 className="text-2xl font-extrabold text-emerald-400 mt-1">{completedTasks}</h4>
              <p className="text-[10px] text-emerald-400/80 font-medium mt-1">
                {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% Completion Rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Troubleshooting Labs</p>
              <h4 className="text-2xl font-extrabold text-indigo-400 mt-1">
                {verifiedLabs} / {labs.length}
              </h4>
              <p className="text-[10px] text-indigo-400/80 font-medium mt-1">
                Verified Scenario Probes
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FlaskConical className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section: Tasks & System Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks Panel (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Task Activity</CardTitle>
                <CardDescription>High priority engineering deliverables</CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All ({tasks.length})
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-700/60">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-700/30 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{task.id}</span>
                      <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        task.priority === 'HIGH' ? 'danger' : task.priority === 'MEDIUM' ? 'warning' : 'neutral'
                      }
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                    <Badge
                      variant={
                        task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : 'neutral'
                      }
                      size="sm"
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Topology / Infrastructure Status (1 Col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Telemetry & Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Express REST API</div>
                    <div className="text-[10px] text-slate-400">Port 5000 • Node.js ES2022</div>
                  </div>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200">PostgreSQL (Prisma ORM)</div>
                    <div className="text-[10px] text-slate-400">Local Docker & Supabase Cloud</div>
                  </div>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Container Security Spec</div>
                    <div className="text-[10px] text-slate-400">UID 10001 • cap_drop ALL</div>
                  </div>
                </div>
                <Badge variant="success" size="sm">Enforced</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
