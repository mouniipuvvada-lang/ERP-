import React from 'react';
import {
  ArrowRight,
  ShoppingCart,
  Package,
  UserPlus,
  CreditCard,
  RefreshCw,
  PlusCircle,
  FileText,
  Users,
  Sparkles,
  Headphones,
  Shirt,
  Sparkle,
  GlassWater,
  Watch,
  Laptop,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { NavTab } from './Sidebar';

interface DashboardCardsProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenAddProduct: () => void;
  onOpenCreateOrder: () => void;
  onOpenAssistant: () => void;
}

// Icon helper for products
const getProductIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('earbud') || n.includes('headphone')) return Headphones;
  if (n.includes('t-shirt') || n.includes('jean') || n.includes('shirt')) return Shirt;
  if (n.includes('cream') || n.includes('shampoo')) return Sparkle;
  if (n.includes('bottle') || n.includes('water')) return GlassWater;
  if (n.includes('watch')) return Watch;
  if (n.includes('laptop') || n.includes('computer')) return Laptop;
  return Package;
};

// 1. Low Stock Alerts Card
export const LowStockCard: React.FC<{ onNavigateTab: (tab: NavTab) => void }> = ({ onNavigateTab }) => {
  const { metrics } = useERP();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">
            ⚠️
          </div>
          <h3 className="text-sm font-bold text-slate-800">Low Stock Alerts</h3>
        </div>
        <button
          onClick={() => onNavigateTab('products')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-semibold border-b border-slate-100">
              <th className="pb-2.5 font-medium">Product Name</th>
              <th className="pb-2.5 font-medium">Category</th>
              <th className="pb-2.5 text-right font-medium">Current Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {metrics.lowStockProducts.slice(0, 4).map((p) => {
              const IconComp = getProductIcon(p.name);
              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 flex items-center gap-2 font-medium text-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate max-w-32 sm:max-w-40">{p.name}</span>
                  </td>
                  <td className="py-2.5 text-slate-500">{p.category}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs ${
                        p.quantity <= 5
                          ? 'bg-rose-100 text-rose-700'
                          : p.quantity <= 8
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.quantity}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. Recent Activities Card
export const RecentActivitiesCard: React.FC<{ onNavigateTab: (tab: NavTab) => void }> = ({
  onNavigateTab,
}) => {
  const { metrics } = useERP();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return { icon: ShoppingCart, bg: 'bg-emerald-50 text-emerald-600' };
      case 'product':
        return { icon: Package, bg: 'bg-blue-50 text-blue-600' };
      case 'employee':
        return { icon: UserPlus, bg: 'bg-purple-50 text-purple-600' };
      case 'payment':
        return { icon: CreditCard, bg: 'bg-emerald-50 text-emerald-600' };
      case 'stock':
      default:
        return { icon: RefreshCw, bg: 'bg-amber-50 text-amber-600' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800">Recent Activities</h3>
        <button
          onClick={() => onNavigateTab('reports')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {metrics.recentActivities.slice(0, 5).map((act) => {
          const { icon: ActIcon, bg } = getActivityIcon(act.type);
          return (
            <div key={act.id} className="relative flex items-center gap-3 text-xs pl-0.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${bg} ring-4 ring-white shadow-xs`}
              >
                <ActIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{act.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{act.relativeTime || 'Recently'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. Top Selling Products Card
export const TopSellingCard: React.FC<{ onNavigateTab: (tab: NavTab) => void }> = ({
  onNavigateTab,
}) => {
  const { metrics } = useERP();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800">Top Selling Products</h3>
        <button
          onClick={() => onNavigateTab('products')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 font-semibold border-b border-slate-100">
              <th className="pb-2.5 font-medium">Product Name</th>
              <th className="pb-2.5 font-medium">Category</th>
              <th className="pb-2.5 text-right font-medium">Units Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {metrics.topSellingProducts.map((p) => {
              const IconComp = getProductIcon(p.name);
              return (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 flex items-center gap-2 font-medium text-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate max-w-32 sm:max-w-40">{p.name}</span>
                  </td>
                  <td className="py-2.5 text-slate-500">{p.category}</td>
                  <td className="py-2.5 text-right font-bold text-slate-800">
                    {p.unitsSold}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4. Quick Actions Card
export const QuickActionsCard: React.FC<DashboardCardsProps> = ({
  onNavigateTab,
  onOpenAddProduct,
  onOpenCreateOrder,
  onOpenAssistant,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <h3 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenAddProduct}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100 text-blue-700 text-xs font-semibold gap-1.5 transition-all active:scale-98"
        >
          <Package className="w-4 h-4 text-blue-600" />
          <span>Add Product</span>
        </button>

        <button
          onClick={onOpenCreateOrder}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100 text-emerald-700 text-xs font-semibold gap-1.5 transition-all active:scale-98"
        >
          <ShoppingCart className="w-4 h-4 text-emerald-600" />
          <span>Create Order</span>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 text-purple-700 text-xs font-semibold gap-1.5 transition-all active:scale-98"
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>View Reports</span>
        </button>

        <button
          onClick={() => onNavigateTab('employees')}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-100 text-indigo-700 text-xs font-semibold gap-1.5 transition-all active:scale-98"
        >
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Manage Employees</span>
        </button>
      </div>

      {/* Full width assistant button */}
      <button
        onClick={onOpenAssistant}
        className="w-full mt-3 py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs active:scale-98"
      >
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <span>Open AI Assistant</span>
      </button>
    </div>
  );
};
