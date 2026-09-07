import React from 'react';
import { Award, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  status?: string;
  size?: number;
  showSubtitle?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score = 87,
  maxScore = 100,
  status = 'GREEN CAMPUS',
  size = 240,
  showSubtitle = true
}) => {
  const normalizedScore = Math.max(0, Math.min(maxScore, score));
  const percentage = (normalizedScore / maxScore) * 100;

  // Arc calculation (240 degree gauge)
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 260 degree arc for gauge look
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  // Color mapping based on score
  let strokeColor = '#10B981'; // Emerald 500 for Green Campus (80-100)
  let statusBadgeBg = 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
  let StatusIcon = ShieldCheck;

  if (normalizedScore < 60) {
    strokeColor = '#EF4444'; // Red 500
    statusBadgeBg = 'bg-red-500/10 text-red-700 border-red-300';
    StatusIcon = AlertTriangle;
  } else if (normalizedScore < 80) {
    strokeColor = '#F59E0B'; // Amber 500
    statusBadgeBg = 'bg-amber-500/10 text-amber-700 border-amber-300';
    StatusIcon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-135"
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Score Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold tracking-tight text-slate-900 font-mono">
              {normalizedScore}
            </span>
            <span className="text-xl font-bold text-slate-600 ml-1">/{maxScore}</span>
          </div>
          
          <div className={`mt-2.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border flex items-center gap-1.5 ${statusBadgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{status || (normalizedScore >= 80 ? 'GREEN CAMPUS' : normalizedScore >= 60 ? 'MODERATE' : 'NEEDS IMPROVEMENT')}</span>
          </div>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 80–100: Green Campus
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> 60–79: Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> 0–59: Needs Impr.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
