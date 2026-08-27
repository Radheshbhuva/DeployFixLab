import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FlaskConical, Filter, Layers } from 'lucide-react';
import { LabCard } from './LabCard';
import { labService } from '@/services/labService';
import { Lab, LabDifficulty, LabCategory } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';

export const LabCatalogPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<LabDifficulty | 'ALL'>('ALL');

  const debouncedSearch = useDebounce(search, 250);
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
    { id: 'AUTH', label: 'Auth & CORS' },
    { id: 'RUNTIME', label: 'Runtime & Memory' },
    { id: 'FULLSTACK', label: 'Multi-Service' },
  ];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lab.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lab.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lab.tags.some((t) => t.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' || lab.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === 'ALL' || lab.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return <LoadingSpinner label="Provisioning interactive lab catalog..." />;
  }

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Header Banner */}
      <div className="rounded-2xl border border-border-default bg-bg-surface p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-6 h-6 text-brand-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Chaos Sandbox & Incident Labs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Hands-on containerized failure simulation environments. Diagnose, execute recovery fixes, and verify 100% SLA health in isolated Docker bridge networks.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-mono w-fit">
          <Layers className="w-4 h-4" />
          <span>{labs.length} Scenarios Available</span>
        </div>
      </div>

      {/* Category Pills & Search Toolbar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl border whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-primary/15 border-brand-primary text-brand-primary font-bold shadow-sm'
                  : 'bg-bg-surface border-border-default text-text-secondary hover:bg-bg-raised hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3 bg-bg-surface p-3.5 rounded-2xl border border-border-default shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search scenarios by title, code (DFIX-LAB-01), or #tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-primary border border-border-default text-text-primary placeholder:text-text-muted text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
            <select
              value={selectedDifficulty}
              aria-label="Filter scenarios by difficulty level"
              onChange={(e) => setSelectedDifficulty(e.target.value as LabDifficulty | 'ALL')}
              className="bg-bg-primary border border-border-default rounded-xl px-3.5 py-2.5 text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-48"
            >
              <option value="ALL">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredLabs.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface rounded-2xl border border-dashed border-border-default">
          <p className="text-sm font-mono text-text-muted">
            No chaos scenarios match your search filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} onStart={handleStartLab} />
          ))}
        </div>
      )}
    </div>
  );
};
