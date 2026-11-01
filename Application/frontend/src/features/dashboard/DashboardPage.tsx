import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { MetricCard } from './MetricCard';
import { ServiceHealthCard } from './ServiceHealthCard';
import { ActivityFeed } from './ActivityFeed';
import { dashboardService } from '@/services/dashboardService';
import { ServiceHealth, SystemMetrics, RecentActivity } from '@/types/dashboard.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Activity, Clock, AlertTriangle, FlaskConical, Users, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const DashboardPage: React.FC = () => {
  const [healthServices, setHealthServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const role = currentUser?.role || 'STUDENT';
  const displayName = currentUser?.fullName || (currentUser as any)?.name || 'Engineer';

  const roleConfig = (() => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Platform Fleet Telemetry & Infrastructure Health',
          subtitle: `Welcome back, ${displayName}. Viewing global cluster operations, multi-tenant container orchestration, and SRE governance telemetry.`,
          badge: 'Cluster Administrator Scope',
          badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
          reqLabel: 'Cluster Telemetry Requests',
          latencyLabel: 'Gateway Avg Latency',
          errorLabel: 'Cluster Error Rate',
          sessionsLabel: 'Active Pods / Global Users',
          reqTrend: '+18.4% fleet throughput',
          latencyTrend: 'Sub-35ms SLA met',
          errorTrend: 'Nominal cluster baseline',
        };
      case 'INSTRUCTOR':
        return {
          title: 'SRE Chaos Operations & Cohort Triage Telemetry',
          subtitle: `Welcome back, ${displayName}. Monitoring active chaos simulations, student incident triage, and resilience evaluation scores.`,
          badge: 'DevOps Instructor Scope',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          reqLabel: 'Cohort Chaos Injections',
          latencyLabel: 'Avg Incident Triage Latency',
          errorLabel: 'Simulation Error Rate',
          sessionsLabel: 'Active Labs / Supervised Cohorts',
          reqTrend: '+8 chaos runs today',
          latencyTrend: 'Target <100ms triage',
          errorTrend: 'Active chaos running',
        };
      default:
        return {
          title: 'Personal Engineering Workspace & Learning Telemetry',
          subtitle: `Welcome back, ${displayName}. Real-time sandbox health, troubleshooting lab execution telemetry, and AI diagnosis activity.`,
          badge: 'Student Workspace Scope',
          badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          reqLabel: 'Personal Sandbox Requests',
          latencyLabel: 'Sandbox Avg Latency',
          errorLabel: 'Personal Error Rate',
          sessionsLabel: 'Active Labs / Assigned Tasks',
          reqTrend: '+12.4% vs last week',
          latencyTrend: '-4ms local latency',
          errorTrend: 'Zero unhandled errors',
        };
    }
  })();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [hData, mData, aData] = await Promise.all([
          dashboardService.getServiceHealth(),
          dashboardService.getSystemMetrics(),
          dashboardService.getRecentActivity(),
        ]);
        if (isMounted) {
          setHealthServices(hData);
          setMetrics(mData);
          setActivities(aData);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.email, currentUser?.role]);

  if (loading) {
    return <LoadingSpinner label="Loading telemetry dashboard..." />;
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Top Banner Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-bg-surface to-bg-raised p-6 rounded-2xl border border-border-default shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${roleConfig.badgeColor}`}
              >
                <Shield className="w-3 h-3" />
                {roleConfig.badge}
              </span>
              <span className="text-xs text-text-muted font-mono">
                Account ID: {currentUser?.id?.slice(0, 14) || 'usr-default'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {roleConfig.title}
            </h1>
            <p className="text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
              {roleConfig.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/logs')}>
              View Live Logs
            </Button>
            <Button variant="primary" onClick={() => navigate('/labs')}>
              <FlaskConical className="w-4 h-4 mr-2" />
              Launch Lab
            </Button>
          </div>
        </div>

        {/* Personalized Metric Cards Grid */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label={roleConfig.reqLabel}
              value={metrics.totalRequests.toLocaleString()}
              icon={<Activity className="w-5 h-5" />}
              trend={{ value: roleConfig.reqTrend, direction: 'up' }}
            />
            <MetricCard
              label={roleConfig.latencyLabel}
              value={metrics.avgResponseTimeMs}
              unit="ms"
              icon={<Clock className="w-5 h-5" />}
              trend={{ value: roleConfig.latencyTrend, direction: 'up' }}
              color="success"
            />
            <MetricCard
              label={roleConfig.errorLabel}
              value={(metrics.errorRate * 100).toFixed(2)}
              unit="%"
              icon={<AlertTriangle className="w-5 h-5" />}
              trend={{ value: roleConfig.errorTrend, direction: 'neutral' }}
              color={metrics.errorRate > 0.05 ? 'danger' : 'success'}
            />
            <MetricCard
              label={roleConfig.sessionsLabel}
              value={`${metrics.activeLabs} / ${metrics.activeUsers}`}
              icon={<Users className="w-5 h-5" />}
              color="info"
            />
          </div>
        )}

        {/* Services Health Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" />
              <h2 className="text-lg font-bold text-text-primary">Microservice Health</h2>
            </div>
            <span className="text-xs font-mono text-text-muted">Auto-refresh: 10s</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {healthServices.map((service) => (
              <ServiceHealthCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Bottom Section: Activity Feed & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} />
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-blue-950/40 border border-blue-800/50">
              <h3 className="text-base font-bold text-blue-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI Diagnosis Engine
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Paste GitHub URLs, Dockerfiles, or log output to generate evidence-backed root cause
                reports and step-by-step recovery commands.
              </p>
              <Button variant="primary" onClick={() => navigate('/diagnosis')} className="w-full">
                Open AI Diagnosis
              </Button>
            </div>

            {role === 'ADMIN' ? (
              <div className="p-6 rounded-xl bg-red-950/30 border border-red-900/40">
                <h3 className="text-base font-bold text-status-danger mb-2">Admin Chaos Sandbox</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Inject active failure scenarios (DB disconnects, memory leaks, container crashes)
                  into live sessions to test recovery resilience.
                </p>
                <Button
                  variant="danger"
                  onClick={() => navigate('/admin/chaos')}
                  className="w-full"
                >
                  Open Chaos Control
                </Button>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-bg-surface border border-border-default">
                <h3 className="text-base font-bold text-text-primary mb-2">
                  Troubleshooting Labs
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  Explore curated incident scenarios to hone your SRE triage skills across container
                  networking, environment variables, and memory leaks.
                </p>
                <Button variant="ghost" onClick={() => navigate('/labs')} className="w-full">
                  Browse Catalog
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
