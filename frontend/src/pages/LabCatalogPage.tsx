import React from 'react';
import { useLabStore } from '@/store/labStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FlaskConical, Play, CheckCircle, ShieldAlert, Database, Server, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LabCatalogPage = () => {
  const { labs, setActiveLab } = useLabStore();
  const navigate = useNavigate();

  const handleStartLab = (id: string) => {
    setActiveLab(id);
    navigate(`/labs/${id}`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'DATABASE': return <Database className="w-4 h-4 text-emerald-400" />;
      case 'NGINX': return <Server className="w-4 h-4 text-blue-400" />;
      case 'SECURITY': return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default: return <Layers className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-blue-400" />
          Container Troubleshooting Lab Catalog
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hands-on diagnostic scenarios for Docker, Nginx, PostgreSQL, and Security violations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Card key={lab.id} className="flex flex-col justify-between hover:border-slate-600 transition-all">
            <div>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(lab.category)}
                    <span className="text-xs font-mono font-semibold text-slate-400">{lab.category}</span>
                  </div>
                  <Badge
                    variant={
                      lab.status === 'VERIFIED' ? 'success' : lab.status === 'IN_PROGRESS' ? 'warning' : 'neutral'
                    }
                    size="sm"
                  >
                    {lab.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2 leading-snug">{lab.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">{lab.summary}</p>
                
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Symptoms:</div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {lab.symptoms.map((sym, idx) => (
                      <li key={idx} className="line-clamp-1">{sym}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </div>

            <CardFooter className="pt-3">
              <span className="text-xs font-mono text-slate-400">Diff: {lab.difficulty}</span>
              <Button
                variant={lab.status === 'VERIFIED' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => handleStartLab(lab.id)}
                rightIcon={lab.status === 'VERIFIED' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4" />}
              >
                {lab.status === 'VERIFIED' ? 'Review Solution' : 'Launch Lab'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
