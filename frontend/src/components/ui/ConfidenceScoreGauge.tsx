import React from 'react';
import { cn } from '@/utils/cn';

export interface ConfidenceScoreGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceScoreGauge: React.FC<ConfidenceScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  let strokeColor = '#64748B'; // slate
  let levelText = 'INSUFFICIENT DATA';

  if (normalizedScore >= 80) {
    strokeColor = '#22C55E'; // green
    levelText = 'HIGH CONFIDENCE';
  } else if (normalizedScore >= 50) {
    strokeColor = '#F59E0B'; // amber
    levelText = 'MEDIUM CONFIDENCE';
  } else if (normalizedScore >= 20) {
    strokeColor = '#EF4444'; // red
    levelText = 'LOW CONFIDENCE';
  }

  const dimensions = {
    sm: { width: 120, height: 70, strokeWidth: 10, fontSize: 'text-xl', labelSize: 'text-[10px]' },
    md: { width: 180, height: 100, strokeWidth: 14, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { width: 240, height: 130, strokeWidth: 18, fontSize: 'text-4xl', labelSize: 'text-sm' },
  }[size];

  const radius = (dimensions.width - dimensions.strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half arc
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="overflow-visible"
      >
        {/* Background Arc */}
        <path
          d={`M ${dimensions.strokeWidth / 2} ${dimensions.height} A ${radius} ${radius} 0 0 1 ${dimensions.width - dimensions.strokeWidth / 2} ${dimensions.height}`}
          fill="none"
          stroke="#334155"
          strokeWidth={dimensions.strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <path
          d={`M ${dimensions.strokeWidth / 2} ${dimensions.height} A ${radius} ${radius} 0 0 1 ${dimensions.width - dimensions.strokeWidth / 2} ${dimensions.height}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={dimensions.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      <div className="-mt-8 text-center">
        <span className={cn('font-bold text-text-primary block', dimensions.fontSize)}>
          {normalizedScore}%
        </span>
        {showLabel && (
          <span
            className={cn('font-semibold uppercase tracking-wider block mt-1', dimensions.labelSize)}
            style={{ color: strokeColor }}
          >
            {levelText}
          </span>
        )}
      </div>
    </div>
  );
};
