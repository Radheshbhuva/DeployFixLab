import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FlaskConical,
  Filter,
  Layers,
  Activity,
  ArrowUpDown,
  X,
  Play,
  Server,
  ShieldAlert,
  Clock,
  CheckCircle2,
  GitCommit,
  Sparkles,
} from 'lucide-react';
import { LabCard } from './LabCard';
import { labService } from '@/services/labService';
import { Lab, LabDifficulty, LabCategory, FailureType } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';

type SortOption = 'recommended' | 'severity' | 'difficulty_desc' | 'duration_asc' | 'solves_desc';

export const LabCatalogPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<LabDifficulty | 'ALL'>('ALL');
  const [selectedFailureType, setSelectedFailureType] = useState<FailureType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [inspectingLab, setInspectingLab] = useState<Lab | null>(null);

  const debouncedSearch = useDebounce(search, 200);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const data = await labService.getLabs();
        setLabs(data);
      } catch (err) {
        console.error('Failed to load lab catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const handleStartLab = (labId: string) => {
    navigate(`/labs/${labId}`);
  };

  const categories: Array<{ id: LabCategory; label: string }> = [
    { id: 'ALL', label: 'All Scenarios' },
    { id: 'DATABASE', label: 'Database' },
    { id: 'NETWORKING', label: 'Networking & DNS' },
    { id: 'AUTH', label: 'Auth & Security' },
    { id: 'RUNTIME', label: 'Runtime & Memory' },
    { id: 'FULLSTACK', label: 'Multi-Service' },
  ];

  const failureTypes: Array<{ id: FailureType | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Failure Types' },
    { id: 'db_connection', label: 'DB Connection' },
    { id: 'dns_failure', label: 'DNS Failure' },
    { id: 'memory_leak', label: 'Memory Leak' },
    { id: 'container_crash', label: 'Container Crash' },
    { id: 'schema_drift', label: 'Schema Drift' },
    { id: 'env_misconfiguration', label: 'Config Drift' },
    { id: 'network_timeout', label: 'Timeout Drop' },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: labs.length };
    labs.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [labs]);

  const filteredAndSortedLabs = useMemo(() => {
    const filtered = labs.filter((lab) => {
      const matchesSearch =
        lab.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lab.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lab.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lab.targetService.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lab.tags.some((t) => t.toLowerCase().includes(debouncedSearch.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || lab.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'ALL' || lab.difficulty === selectedDifficulty;

      const matchesFailureType =
        selectedFailureType === 'ALL' || lab.failureTypes.includes(selectedFailureType);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFailureType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        const severityRank: Record<string, number> = { P1_CRITICAL: 3, P2_MAJOR: 2, P3_MEDIUM: 1 };
        return (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
      }
      if (sortBy === 'difficulty_desc') {
        const diffRank: Record<string, number> = { EXPERT: 4, ADVANCED: 3, INTERMEDIATE: 2, BEGINNER: 1 };
        return (diffRank[b.difficulty] || 0) - (diffRank[a.difficulty] || 0);
      }
      if (sortBy === 'duration_asc') {
        return a.estimatedMinutes - b.estimatedMinutes;
      }
      if (sortBy === 'solves_desc') {
        return b.completionCount - a.completionCount;
      }
      return 0;
    });
  }, [labs, debouncedSearch, selectedCategory, selectedDifficulty, selectedFailureType, sortBy]);

  const totalSolves = useMemo(() => {
    return labs.reduce((acc, curr) => acc + curr.completionCount, 0);
  }, [labs]);

  if (loading) {
    return <LoadingSpinner label="Provisioning interactive SRE lab catalog..." />;
  }

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header Banner & SRE Engine Telemetry */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-brand-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Chaos Sandbox & Incident Labs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed font-sans">
            Containerized failure simulation environments. Diagnose real-world microservice faults, execute live shell fixes, and verify SLA recovery in isolated Docker bridge networks.
          </p>
        </div>

        {/* Live Cluster Engine Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
            <div className="flex flex-col text-[10px]">
              <span className="font-semibold">ENGINE: DOCKER v25.0</span>
              <span className="opacity-80">Bridge: 172.28.0.0/16</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/25 text-brand-primary">
            <Layers className="w-4 h-4" />
            <div className="flex flex-col text-[10px]">
              <span className="font-semibold">{labs.length} SCENARIOS</span>
              <span className="opacity-80">{totalSolves} Verified Solves</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills, Filters & Search Toolbar */}
      <div className="space-y-3.5">
        {/* Category Tabs with Dynamic Count Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-primary/15 border-brand-primary text-brand-primary font-bold shadow-sm'
                    : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-raised hover:text-text-primary'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-brand-primary text-white font-bold' : 'bg-bg-raised text-text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Difficulty & Sorting Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-bg-surface p-3.5 rounded-2xl border border-border-default shadow-sm items-center">
          {/* Search Box */}
          <div className="relative md:col-span-6 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search scenarios by title, code (DFIX-LAB-01), target node, or #tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg-primary border border-border-default text-text-primary placeholder:text-text-muted text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 md:col-span-3 w-full">
            <Filter className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <select
              value={selectedDifficulty}
              aria-label="Filter scenarios by difficulty level"
              onChange={(e) => setSelectedDifficulty(e.target.value as LabDifficulty | 'ALL')}
              className="bg-bg-primary border border-border-default rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full"
            >
              <option value="ALL">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          {/* Sorting Selector */}
          <div className="flex items-center gap-1.5 md:col-span-3 w-full">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
            <select
              value={sortBy}
              aria-label="Sort scenarios by criteria"
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-bg-primary border border-border-default rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="severity">Sort: P1 Critical First</option>
              <option value="difficulty_desc">Sort: Hardest First</option>
              <option value="duration_asc">Sort: Shortest First</option>
              <option value="solves_desc">Sort: Most Solved</option>
            </select>
          </div>
        </div>

        {/* Quick Failure Type Tag Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
          <span className="text-text-muted text-[10px] uppercase font-semibold mr-1">Failure Type:</span>
          {failureTypes.map((ft) => (
            <button
              key={ft.id}
              type="button"
              onClick={() => setSelectedFailureType(ft.id)}
              className={`px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                selectedFailureType === ft.id
                  ? 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary font-bold'
                  : 'bg-bg-surface/80 border-border-default text-text-secondary hover:bg-bg-raised'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredAndSortedLabs.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface rounded-2xl border border-dashed border-border-default space-y-3">
          <p className="text-sm font-mono text-text-muted">
            No chaos scenarios match your search filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setSelectedDifficulty('ALL');
              setSelectedFailureType('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSortedLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              onStart={handleStartLab}
              onInspect={(l) => setInspectingLab(l)}
            />
          ))}
        </div>
      )}

      {/* Interactive Scenario Details & Topology Inspection Modal */}
      {inspectingLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-bg-surface border border-border-default rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 text-left relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border-default">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-bg-raised border border-border-default text-text-primary">
                    {inspectingLab.code}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
                    {inspectingLab.category}
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    {inspectingLab.severity.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text-primary">{inspectingLab.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setInspectingLab(null)}
                className="p-2 rounded-xl bg-bg-raised hover:bg-bg-surface border border-border-default text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Architecture Flow & Target Service */}
            <div className="p-4 rounded-2xl bg-bg-raised border border-border-default space-y-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-brand-primary font-bold">
                <Server className="w-4 h-4" />
                <span>Target Service: {inspectingLab.targetService}</span>
              </div>
              {inspectingLab.topologyFlow && (
                <div className="flex items-center gap-1.5 text-text-secondary text-[11px] pt-1">
                  <GitCommit className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Pipeline: {inspectingLab.topologyFlow.join(' ➔ ')}</span>
                </div>
              )}
            </div>

            {/* Topology Nodes Grid */}
            {inspectingLab.topology && inspectingLab.topology.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                  Container Sandbox Nodes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspectingLab.topology.map((node, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-bg-primary border border-border-default text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-primary truncate">{node.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            node.status === 'HEALTHY'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {node.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted">Image: {node.image}</div>
                      <div className="text-[10px] text-text-muted">IP: {node.internalIp} | Port: {node.port}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SLA Impact & Symptoms */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                SLA & Failure Profile
              </h3>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-sans leading-relaxed">
                <strong>Incident Symptom:</strong> {inspectingLab.incidentSymptoms}
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                Triage Objectives
              </h3>
              <div className="space-y-1.5 text-xs font-sans text-text-secondary">
                {inspectingLab.objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border-default flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {inspectingLab.estimatedMinutes} mins
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  {inspectingLab.completionCount} completed
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingLab(null)}
                  className="px-4 py-2 rounded-xl bg-bg-raised hover:bg-bg-surface border border-border-default text-text-secondary text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleStartLab(inspectingLab.id)}
                  className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Sandbox</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
