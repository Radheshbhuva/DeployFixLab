import React, { useState, useRef } from 'react';
import { UploadedFile } from '@/types/diagnosis.types';
import { Upload, FileText, CheckCircle2, Trash2, ShieldAlert } from 'lucide-react';

interface FileUploadZoneProps {
  files: UploadedFile[];
  onUpload: (file: { name: string; type: UploadedFile['type']; sizeBytes: number }) => void;
  onRemove: (id: string) => void;
  error: string | null;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ files, onUpload, onRemove, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const determineFileType = (filename: string): UploadedFile['type'] => {
    const lower = filename.toLowerCase();
    if (lower.includes('dockerfile')) return 'dockerfile';
    if (lower.includes('docker-compose') || lower.endsWith('.yml') || lower.endsWith('.yaml')) return 'docker_compose';
    if (lower.includes('nginx')) return 'nginx_conf';
    if (lower.includes('package.json')) return 'package_json';
    if (lower.includes('.env.example')) return 'env_example';
    if (lower.endsWith('.log') || lower.endsWith('.txt')) return 'log';
    return 'other';
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      onUpload({
        name: f.name,
        type: determineFileType(f.name),
        sizeBytes: f.size,
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-primary bg-brand-primary/10'
            : 'border-border-default bg-bg-raised/40 hover:border-brand-primary/50 hover:bg-bg-raised/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 bg-bg-surface rounded-full text-brand-primary border border-border-default shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              <span className="text-brand-primary font-semibold">Click to upload</span> or drag and drop configuration files & logs
            </p>
            <p className="text-xs text-text-muted mt-1">
              Accepts: <code className="text-text-secondary">Dockerfile</code>, <code className="text-text-secondary">docker-compose.yml</code>, <code className="text-text-secondary">nginx.conf</code>, <code className="text-text-secondary">package.json</code>, <code className="text-text-secondary">.env.example</code>, <code className="text-text-secondary">*.log</code> (Max 10 files · 2MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Security Warning Alert */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 rounded-lg p-3 text-xs">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-red-700 dark:text-red-200">Security Rule Violation:</strong>
            {error}
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-muted px-1">
            Uploaded Context Files ({files.length}):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-bg-raised border border-border-default rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <FileText className="w-4 h-4 text-brand-primary shrink-0" />
                  <div className="truncate">
                    <div className="font-medium text-text-primary truncate">{file.name}</div>
                    <div className="text-[11px] text-text-muted font-mono">
                      {(file.sizeBytes / 1024).toFixed(1)} KB · {file.evidenceCount || 0} evidence items
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(file.id);
                    }}
                    className="p-1 text-text-muted hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
