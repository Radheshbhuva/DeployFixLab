import React, { HTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table = ({ children, className, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-700/60 bg-slate-800/80">
    <table className={twMerge('w-full text-left text-sm text-slate-200', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={twMerge('bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-700/60', className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={twMerge('divide-y divide-slate-700/50', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={twMerge('hover:bg-slate-700/30 transition-colors duration-150', className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={twMerge('px-6 py-3.5 tracking-wider font-semibold', className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={twMerge('px-6 py-4 whitespace-nowrap text-sm text-slate-300', className)} {...props}>
    {children}
  </td>
);
