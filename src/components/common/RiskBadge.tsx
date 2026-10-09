import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  category: 'Low' | 'Medium' | 'High';
  score?: number;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, score, showIcon = true }) => {
  if (category === 'High') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F9D4E5] text-[#D97979] border border-[#D97979]/20 shadow-xs">
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-[#D97979]" />}
        <span>Recommended Support</span>
        {score !== undefined && <span className="opacity-80">({score})</span>}
      </span>
    );
  }

  if (category === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFE7A5] text-[#8C6D1F] border border-[#E9B95F]/30 shadow-xs">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-[#8C6D1F]" />}
        <span>Needs Attention</span>
        {score !== undefined && <span className="opacity-80">({score})</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D1E5E1] text-[#3B6E63] border border-[#75A994]/20 shadow-xs">
      {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-[#75A994]" />}
      <span>Steady Progress</span>
      {score !== undefined && <span className="opacity-80">({score})</span>}
    </span>
  );
};
