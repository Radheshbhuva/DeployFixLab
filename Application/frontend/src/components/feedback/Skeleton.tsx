import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-bg-raised/70', className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
};
