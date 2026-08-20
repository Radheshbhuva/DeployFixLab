import React from 'react';
import { TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { TelemetryHourlyPoint, MttrDailyPoint } from '@/types/dashboard.types';

export interface TelemetryChartsSectionProps {
  hourlyTelemetry: TelemetryHourlyPoint[];
  mttrHistory: MttrDailyPoint[];
  currentMttrMinutes: number;
  resolutionSuccessRate: number;
}

export const TelemetryChartsSection: React.FC<TelemetryChartsSectionProps> = ({
  hourlyTelemetry,
  mttrHistory,
  currentMttrMinutes,
  resolutionSuccessRate,
}) => {
  // SVG Area calculation for 24h requests
  const maxReq = Math.max(...hourlyTelemetry.map((p) => p.requests), 1000);
  const maxErr = Math.max(...hourlyTelemetry.map((p) => p.errors), 10);
  const svgWidth = 460;
  const svgHeight = 110;

  const points = hourlyTelemetry.map((p, i) => {
    const x = (i / (hourlyTelemetry.length - 1)) * svgWidth;
    const y = svgHeight - (p.requests / maxReq) * (svgHeight - 20) - 10;
    return { x, y, ...p };
  });

  const pathD = points.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
    ''
  );
  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  // 7-day MTTR Path
  const maxMttr = Math.max(...mttrHistory.map((m) => m.mttrMinutes), 50);
  const mttrWidth = 280;
  const mttrHeight = 85;
  const mttrPoints = mttrHistory.map((m, i) => {
    const x = (i / (mttrHistory.length - 1)) * mttrWidth;
    const y = mttrHeight - (m.mttrMinutes / maxMttr) * (mttrHeight - 16) - 8;
    return { x, y, ...m };
  });

  const mttrPathD = mttrPoints.reduce(
    (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
    ''
  );

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Incident Resolution & Fleet Telemetry Charts
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">Live 24h & 7d Baselines</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. 24-Hour Throughput & Error Rate (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  24h Telemetry Throughput & Errors
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Probe volume (Cyan area) vs HTTP 5xx errors (Rose bars)
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2.5 h-1 bg-cyan-400 rounded-full" /> Probes
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-2.5 h-2.5 bg-rose-500/80 rounded" /> 5xx Errors
                </span>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="relative py-2 overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-28 overflow-visible"
              >
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Error Bars */}
                {points.map((pt, idx) => {
                  const barH = (pt.errors / maxErr) * 45;
                  return (
                    <rect
                      key={`err-${idx}`}
                      x={pt.x - 3}
                      y={svgHeight - barH}
                      width="6"
                      height={barH}
                      className="fill-rose-500/70 hover:fill-rose-400 transition-colors"
                      rx="1"
                    />
                  );
                })}

                {/* Area Fill */}
                <path d={areaD} fill="url(#cyanGradient)" />

                {/* Line Stroke */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {points.map((pt, idx) => (
                  <circle
                    key={`dot-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    className="fill-slate-950 stroke-cyan-400 stroke-2 hover:r-5 transition-all cursor-pointer"
                  />
                ))}
              </svg>

              {/* X-Axis Hour Labels */}
              <div className="flex justify-between pt-2 text-[10px] font-mono text-slate-500">
                {hourlyTelemetry.map((h, i) => (
                  <span key={i} className={i % 2 !== 0 ? 'hidden sm:inline' : ''}>
                    {h.hour}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 7-Day MTTR & Fix Pass Rate (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* MTTR Reduction Curve */}
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  MTTR (Mean Time to Recovery)
                </h3>
                <p className="text-[10px] font-mono text-slate-400">7-Day Resolution Velocity</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold font-mono text-emerald-400">
                  {currentMttrMinutes}m
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">-90.5% vs wk 1</span>
              </div>
            </div>

            <div className="py-1">
              <svg
                viewBox={`0 0 ${mttrWidth} ${mttrHeight}`}
                className="w-full h-16 overflow-visible"
              >
                <path
                  d={mttrPathD}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {mttrPoints.map((pt, idx) => (
                  <circle
                    key={`m-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="3"
                    className="fill-slate-950 stroke-emerald-400 stroke-2"
                  />
                ))}
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                {mttrHistory.map((m, i) => (
                  <span key={i}>{m.day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Pass Rate Circular Gauge */}
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5 shadow-xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                Verification Confidence
              </span>
              <h4 className="font-bold text-sm text-slate-100 leading-snug">
                Automated Incident Fix Pass Rate
              </h4>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                142/147 Sandboxes remediated successfully
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000"
                  strokeDasharray={`${resolutionSuccessRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-mono font-extrabold text-slate-100">
                {resolutionSuccessRate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
