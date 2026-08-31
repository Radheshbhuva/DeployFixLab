import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const toast = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('User preferences updated successfully.');
  };

  return (
    <div className="space-y-6 pb-8 max-w-3xl">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-brand-primary" />
        <h1 className="text-2xl font-bold text-text-primary">Account & Workspace Settings</h1>
      </div>

      <Card title="User Profile">
        <form onSubmit={handleSave} className="space-y-4 mt-3">
          <Input label="Full Name" defaultValue={user?.fullName || ''} />
          <Input label="Email Address" defaultValue={user?.email || ''} disabled />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-1">
              Role Permission Level
            </label>
            <Input defaultValue={user?.role || 'STUDENT'} disabled className="font-mono" />
          </div>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </form>
      </Card>

      <Card title="Environment Feature Flags">
        <div className="space-y-3 mt-3 text-xs text-text-secondary">
          <div className="flex items-center justify-between p-3 rounded bg-bg-primary border border-border-default">
            <div>
              <p className="font-bold text-text-primary">AI Diagnosis Engine (Gemini)</p>
              <p className="text-[11px] text-text-muted">Synthesize evidence-backed recovery plans from log output.</p>
            </div>
            <span className="text-status-success font-mono font-bold">ENABLED</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-bg-primary border border-border-default">
            <div>
              <p className="font-bold text-text-primary">Admin Chaos Sandbox</p>
              <p className="text-[11px] text-text-muted">Inject active failure scenarios into student containers.</p>
            </div>
            <span className="text-status-success font-mono font-bold">ENABLED</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
