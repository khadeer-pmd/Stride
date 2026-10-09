import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'improving' | 'stable' | 'declining';
  showLabel?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ trend, showLabel = true }) => {
  if (trend === 'improving') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#548E7D] bg-[#D1E5E1] px-2.5 py-0.5 rounded-full">
        <TrendingUp className="w-3.5 h-3.5" />
        {showLabel && <span>Improving</span>}
      </span>
    );
  }

  if (trend === 'declining') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C45E5E] bg-[#F9D4E5] px-2.5 py-0.5 rounded-full">
        <TrendingDown className="w-3.5 h-3.5" />
        {showLabel && <span>Changing</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#666D69] bg-[#E9EEEB] px-2.5 py-0.5 rounded-full">
      <Minus className="w-3.5 h-3.5" />
      {showLabel && <span>Steady</span>}
    </span>
  );
};
