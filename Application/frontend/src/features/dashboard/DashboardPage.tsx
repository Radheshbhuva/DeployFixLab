import React, { useEffect, useState } from 'react';
import { MetricCard } from './MetricCard';
import { ServiceHealthCard } from './ServiceHealthCard';
import { ActivityFeed } from './ActivityFeed';
import { dashboardService } from '@/services/dashboardService';
import { ServiceHealth, SystemMetrics, RecentActivity } from '@/types/dashboard.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Activity, Clock, AlertTriangle, FlaskConical, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [healthServices, setHealthServices] = useState<ServiceHealth[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hData, mData, aData] = await Promise.all([
          dashboardService.getServiceHealth(),
          dashboardService.getSystemMetrics(),
          dashboardService.getRecentActivity(),
        ]);
        setHealthServices(hData);
        setMetrics(mData);
        setActivities(aData);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading telemetry dashboard..." />;
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-bg-surface to-bg-raised p-6 rounded-2xl border border-border-default shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            System Telemetry & Engineering Overview
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Real-time operational health, lab execution telemetry, and AI diagnosis activity across all sandbox environments.
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

      {/* Metric Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Telemetry Requests"
            value={metrics.totalRequests.toLocaleString()}
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: '+12.4% vs last week', direction: 'up' }}
          />
          <MetricCard
            label="Avg Response Time"
            value={metrics.avgResponseTimeMs}
            unit="ms"
            icon={<Clock className="w-5 h-5" />}
            trend={{ value: '-3ms latency', direction: 'up' }}
            color="success"
          />
          <MetricCard
            label="System Error Rate"
            value={(metrics.errorRate * 100).toFixed(2)}
            unit="%"
            icon={<AlertTriangle className="w-5 h-5" />}
            trend={{ value: 'Nominal baseline', direction: 'neutral' }}
            color={metrics.errorRate > 0.05 ? 'danger' : 'success'}
          />
          <MetricCard
            label="Active Sessions / Users"
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
            <h3 className="text-base font-bold text-blue-300 mb-2">AI Diagnosis Engine</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Paste GitHub URLs, Dockerfiles, or log output to generate evidence-backed root cause reports and step-by-step recovery commands.
            </p>
            <Button variant="primary" onClick={() => navigate('/diagnosis')} className="w-full">
              Open AI Diagnosis
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-red-950/30 border border-red-900/40">
            <h3 className="text-base font-bold text-status-danger mb-2">Admin Chaos Sandbox</h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Inject active failure scenarios (DB disconnects, memory leaks, container crashes) into live sessions to test recovery resilience.
            </p>
            <Button variant="danger" onClick={() => navigate('/admin/chaos')} className="w-full">
              Open Chaos Control
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
