import React from 'react';
import { Skeleton } from '@/components/feedback/Skeleton';
import { cn } from '@/utils/cn';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full bg-bg-surface rounded-xl border border-border-default overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-raised/60 border-b border-border-default text-xs font-semibold text-text-muted uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default/50 text-sm text-text-primary">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <Skeleton className="h-5 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-bg-raised/50'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
