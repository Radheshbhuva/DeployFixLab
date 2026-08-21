import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges standard class names correctly', () => {
    const result = cn('bg-blue-500', 'text-white', 'p-4');
    expect(result).toBe('bg-blue-500 text-white p-4');
  });

  it('handles conditional classes', () => {
    const isError = true;
    const isSuccess = false;
    const result = cn('base', isError && 'border-red-500', isSuccess && 'border-green-500');
    expect(result).toBe('base border-red-500');
  });

  it('resolves conflicting tailwind classes by keeping the last', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });
});
