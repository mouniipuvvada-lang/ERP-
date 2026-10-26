import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trendText: string;
  isPositive: boolean;
  icon: LucideIcon;
  variant: 'blue' | 'green' | 'coral' | 'orange';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trendText,
  isPositive,
  icon: Icon,
  variant,
}) => {
  const config = {
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-100',
      strokeColor: '#3b82f6',
      fillGradient: 'url(#blueGrad)',
      accentDot: '#2563eb',
    },
    green: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      strokeColor: '#10b981',
      fillGradient: 'url(#greenGrad)',
      accentDot: '#059669',
    },
    coral: {
      bgIcon: 'bg-rose-50 text-rose-500 border-rose-100',
      strokeColor: '#f43f5e',
      fillGradient: 'url(#coralGrad)',
      accentDot: '#e11d48',
    },
    orange: {
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      strokeColor: '#f59e0b',
      fillGradient: 'url(#orangeGrad)',
      accentDot: '#d97706',
    },
  }[variant];

  // Distinct wave paths for the 4 cards matching the reference image
  const pathD = {
    blue: 'M0,35 Q30,40 60,28 T120,25 T180,10 L180,45 L0,45 Z',
    green: 'M0,38 Q30,35 60,32 T120,24 T180,8 L180,45 L0,45 Z',
    coral: 'M0,36 Q30,30 60,33 T120,28 T180,12 L180,45 L0,45 Z',
    orange: 'M0,32 Q30,22 60,30 T120,24 T180,14 L180,45 L0,45 Z',
  }[variant];

  const lineD = {
    blue: 'M0,35 Q30,40 60,28 T120,25 T180,10',
    green: 'M0,38 Q30,35 60,32 T120,24 T180,8',
    coral: 'M0,36 Q30,30 60,33 T120,28 T180,12',
    orange: 'M0,32 Q30,22 60,30 T120,24 T180,14',
  }[variant];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.bgIcon}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide">
          {title}
        </span>
      </div>

      {/* Main value */}
      <div className="mt-3">
        <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          {isPositive ? (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {trendText}
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-rose-500">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {trendText}
            </span>
          )}
        </div>
      </div>

      {/* Sparkline wave at the bottom */}
      <div className="mt-2 h-11 w-full -mb-2 overflow-hidden">
        <svg
          viewBox="0 0 180 45"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={pathD} fill={config.fillGradient} />
          <path
            d={lineD}
            fill="none"
            stroke={config.strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
