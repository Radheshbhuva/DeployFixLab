import React, { useEffect, useState } from 'react';
import { LabCard } from './LabCard';
import { labService } from '@/services/labService';
import { Lab, LabDifficulty } from '@/types/lab.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FlaskConical } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export const LabCatalogPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<LabDifficulty | 'ALL'>('ALL');

  const debouncedSearch = useDebounce(search, 300);
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

  const handleStartLab = async (labId: string) => {
    navigate(`/labs/${labId}`);
  };

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lab.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      lab.tags.some((t) => t.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'ALL' || lab.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return <LoadingSpinner label="Loading interactive lab catalog..." />;
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-brand-primary" />
            <h1 className="text-2xl font-bold text-text-primary">
              Troubleshooting Lab Catalog
            </h1>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Hands-on production failure simulation environments for engineering practice.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-bg-surface p-4 rounded-xl border border-border-default">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search scenarios by title, description, or #tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
          <select
            value={selectedDifficulty}
            aria-label="Filter scenarios by difficulty level"
            onChange={(e) => setSelectedDifficulty(e.target.value as LabDifficulty | 'ALL')}
            className="bg-bg-primary border border-border-default rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary w-full md:w-48"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredLabs.length === 0 ? (
        <div className="text-center py-16 bg-bg-surface/40 rounded-xl border border-dashed border-border-default">
          <p className="text-sm text-text-muted">No labs matched your search filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} onStart={handleStartLab} />
          ))}
        </div>
      )}
    </div>
  );
};
