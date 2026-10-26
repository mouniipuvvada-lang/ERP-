import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SalesChart: React.FC = () => {
  const { data } = useERP();
  const cur = data.settings.currency || '₹';
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const monthlyData = [
    { month: 'Nov', sales: 72000, label: '₹ 72,000' },
    { month: 'Dec', sales: 88000, label: '₹ 88,000' },
    { month: 'Jan', sales: 118000, label: '₹ 1,18,000' },
    { month: 'Feb', sales: 145000, label: '₹ 1,45,000' },
    { month: 'Mar', sales: 140000, label: '₹ 1,40,000' },
    { month: 'Apr', sales: 198750, label: '₹ 1,98,750' },
  ];

  const maxVal = 200000;
  const chartHeight = 160;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">Sales Overview</h3>
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
            <option>Year to Date</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex items-end gap-3 pt-2">
        {/* Y Axis */}
        <div className="flex flex-col justify-between h-40 text-[10px] font-medium text-slate-400 pr-2 shrink-0 select-none">
          <span>200K</span>
          <span>150K</span>
          <span>100K</span>
          <span>50K</span>
          <span>0</span>
        </div>

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-between h-40 pt-4 border-b border-slate-100 relative">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-slate-200 w-full h-0" />
            <div className="border-b border-dashed border-slate-200 w-full h-0" />
            <div className="border-b border-dashed border-slate-200 w-full h-0" />
            <div className="border-b border-dashed border-slate-200 w-full h-0" />
            <div className="border-b border-dashed border-slate-200 w-full h-0" />
          </div>

          {monthlyData.map((item, idx) => {
            const heightPercent = Math.min(100, Math.round((item.sales / maxVal) * 100));
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center group relative h-full justify-end px-1 sm:px-2 z-10"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute -top-9 bg-slate-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none animate-in fade-in zoom-in-95">
                    {cur} {item.sales.toLocaleString('en-IN')}
                  </div>
                )}

                {/* Bar */}
                <div
                  className="w-full max-w-8 bg-indigo-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    height: `${heightPercent}%`,
                    background:
                      idx === 5
                        ? 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)'
                        : 'linear-gradient(180deg, #6366f1 0%, #818cf8 100%)',
                  }}
                />

                {/* Label */}
                <span className="text-[11px] font-semibold text-slate-500 mt-2 block select-none">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
