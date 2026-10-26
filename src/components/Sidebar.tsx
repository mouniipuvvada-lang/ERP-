import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3,
  Sparkles,
  Settings,
  Bot,
  ArrowRight,
  X,
  Boxes,
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'employees'
  | 'products'
  | 'orders'
  | 'expenses'
  | 'reports'
  | 'assistant'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenAssistant: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenAssistant,
}) => {
  const menuItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'orders', label: 'Sales & Orders', icon: ShoppingCart },
    { id: 'expenses', label: 'Expenses & Finance', icon: Wallet },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-68 bg-[#0b1329] text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
                SmartERP
              </h1>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                AI-Powered Business Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Need Help Assistant Promo Card */}
        <div className="p-4 m-3 rounded-2xl bg-linear-to-b from-slate-900/90 to-slate-950 border border-slate-800/80 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white">Need help?</h4>
          <p className="text-[12px] text-slate-400 mt-1 mb-3 leading-relaxed px-1">
            Ask our AI Business Assistant for insights, reports and more!
          </p>
          <button
            onClick={() => {
              onOpenAssistant();
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 active:scale-98"
          >
            <span>Chat Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
