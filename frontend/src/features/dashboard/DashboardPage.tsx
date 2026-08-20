import React, { useEffect, useState, useCallback } from 'react';
import { MetricCard } from './MetricCard';
import { DashboardHeader } from './components/DashboardHeader';
import { ContainerFleetGrid } from './components/ContainerFleetGrid';
import { ActiveIncidentsWidget } from './components/ActiveIncidentsWidget';
import { ChaosLabQuickLauncher } from './components/ChaosLabQuickLauncher';
import { TelemetryChartsSection } from './components/TelemetryChartsSection';
import { ActivityFeed } from './ActivityFeed';
import { dashboardService } from '@/services/dashboardService';
import {
  ContainerFleetNode,
  ActiveIncident,
  ChaosQuickLaunchPreset,
  TelemetryHourlyPoint,
  MttrDailyPoint,
  SystemMetrics,
  RecentActivity,
} from '@/types/dashboard.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Activity, Clock, AlertTriangle, Users } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [fleetNodes, setFleetNodes] = useState<ContainerFleetNode[]>([]);
  const [incidents, setIncidents] = useState<ActiveIncident[]>([]);
  const [chaosPresets, setChaosPresets] = useState<ChaosQuickLaunchPreset[]>([]);
  const [hourlyTelemetry, setHourlyTelemetry] = useState<TelemetryHourlyPoint[]>([]);
  const [mttrHistory, setMttrHistory] = useState<MttrDailyPoint[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [fData, incData, preData, hData, mHistData, mData, aData] = await Promise.all([
        dashboardService.getContainerFleet(),
        dashboardService.getActiveIncidents(),
        dashboardService.getChaosPresets(),
        dashboardService.getHourlyTelemetry(),
        dashboardService.getMttrHistory(),
        dashboardService.getSystemMetrics(),
        dashboardService.getRecentActivity(),
      ]);

      setFleetNodes(fData);
      setIncidents(incData);
      setChaosPresets(preData);
      setHourlyTelemetry(hData);
      setMttrHistory(mHistData);
      setMetrics(mData);
      setActivities(aData);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000); // 15s auto-polling
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingSpinner label="Initializing SRE Command Center..." />;
  }

  const nodesHealthy = fleetNodes.filter((n) => n.status === 'healthy').length;
  const nodesTotal = fleetNodes.length;

  return (
    <div className="space-y-8 pb-12 text-left">
      {/* 1. Master Command Bar Header */}
      <DashboardHeader
        nodesHealthy={nodesHealthy}
        nodesTotal={nodesTotal}
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 2. Executive Metric Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Telemetry Requests"
            value={metrics.totalRequests.toLocaleString()}
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: '+14.2% vs last week', direction: 'up' }}
          />
          <MetricCard
            label="Avg Cluster Latency"
            value={metrics.avgResponseTimeMs}
            unit="ms"
            icon={<Clock className="w-5 h-5" />}
            trend={{ value: '-4ms latency', direction: 'up' }}
            color="success"
          />
          <MetricCard
            label="System Error Rate"
            value={(metrics.errorRate * 100).toFixed(2)}
            unit="%"
            icon={<AlertTriangle className="w-5 h-5" />}
            trend={{ value: 'Nominal baseline (<1%)', direction: 'neutral' }}
            color={metrics.errorRate > 0.02 ? 'danger' : 'success'}
          />
          <MetricCard
            label="Active Sandboxes / Users"
            value={`${metrics.activeLabs} / ${metrics.activeUsers}`}
            icon={<Users className="w-5 h-5" />}
            color="info"
          />
        </div>
      )}

      {/* 3. Container Fleet Health Grid (API Gateway, PostgreSQL, Nginx, Redis) */}
      <ContainerFleetGrid nodes={fleetNodes} />

      {/* 4. Middle Split Grid: Active Incidents & Chaos Quick-Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Active Incidents Triage (7 cols) */}
        <div className="lg:col-span-7">
          <ActiveIncidentsWidget incidents={incidents} />
        </div>

        {/* Right Column: Chaos Lab Quick-Launcher (5 cols) */}
        <div className="lg:col-span-5">
          <ChaosLabQuickLauncher presets={chaosPresets} />
        </div>
      </div>

      {/* 5. Incident Resolution Telemetry & Historical Charts */}
      <TelemetryChartsSection
        hourlyTelemetry={hourlyTelemetry}
        mttrHistory={mttrHistory}
        currentMttrMinutes={metrics?.mttrCurrentMinutes || 4.2}
        resolutionSuccessRate={metrics?.resolutionSuccessRate || 96.4}
      />

      {/* 6. Live Engineering Activity & Chaos Audit Feed */}
      <ActivityFeed activities={activities} />
    </div>
  );
};
