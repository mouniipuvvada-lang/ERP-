import React from 'react';
import { useERP } from '../context/ERPContext';

export const CategoryDonutChart: React.FC = () => {
  const { metrics } = useERP();

  const categories = [
    { name: 'Electronics', pct: 32, count: metrics.categoryCounts['Electronics'] || 184, color: '#3b82f6' },
    { name: 'Clothing', pct: 24, count: metrics.categoryCounts['Clothing'] || 138, color: '#6366f1' },
    { name: 'Home & Living', pct: 18, count: metrics.categoryCounts['Home & Living'] || 102, color: '#10b981' },
    { name: 'Beauty & Health', pct: 14, count: metrics.categoryCounts['Beauty & Health'] || 85, color: '#f59e0b' },
    { name: 'Others', pct: 12, count: metrics.categoryCounts['Others'] || 63, color: '#f43f5e' },
  ];

  // SVG Donut calculation
  const size = 150;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Title */}
      <h3 className="text-base font-bold text-slate-800 mb-2">Products by Category</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto pt-2">
        {/* Donut SVG with center text */}
        <div className="relative w-38 h-38 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {categories.map((cat, idx) => {
              const strokeDasharray = `${(cat.pct / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += cat.pct;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-500 ease-out hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-xl font-extrabold text-slate-800 leading-none">
              {metrics.totalProductsInStock}
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-1">
              Total Products
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-600 truncate">{cat.name}</span>
              </div>
              <span className="font-bold text-slate-800 ml-2">{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
