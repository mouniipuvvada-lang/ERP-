import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Sparkles,
  User,
  Settings as SettingsIcon,
  RotateCcw,
  LogOut,
  AlertTriangle,
  Package,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { NavTab } from './Sidebar';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onToggleAssistant: () => void;
  isAssistantOpen: boolean;
  onNavigateTab: (tab: NavTab) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  onToggleAssistant,
  isAssistantOpen,
  onNavigateTab,
}) => {
  const { data, metrics, resetData } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchedProducts = data.products
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedOrders = data.orders
      .filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))
      .slice(0, 3);

    const matchedEmployees = data.employees
      .filter((e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q))
      .slice(0, 3);

    return {
      products: matchedProducts,
      orders: matchedOrders,
      employees: matchedEmployees,
      total: matchedProducts.length + matchedOrders.length + matchedEmployees.length,
    };
  }, [searchQuery, data]);

  const notifications = [
    {
      id: 1,
      title: 'Low Stock Alert',
      desc: `${metrics.lowStockCount} items need immediate replenishment`,
      time: '10m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'New High-Value Order #ORD-1042',
      desc: 'Aarav Mehta placed an order of ₹9,998.46',
      time: '2h ago',
      type: 'order',
    },
    {
      id: 3,
      title: 'New Employee Onboarded',
      desc: 'Ravi Kumar joined Sales Department',
      time: '5h ago',
      type: 'employee',
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-8 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search anything... (products, orders, reports, etc.)"
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200/90 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchResults && (
            <div className="absolute left-0 right-0 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
              {searchResults.total === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No matching items found for "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Products ({searchResults.products.length})
                      </div>
                      {searchResults.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onNavigateTab('products');
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Package className="w-4 h-4 text-indigo-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{p.name}</p>
                              <p className="text-xs text-slate-400">{p.sku} • {p.category}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {data.settings.currency}{p.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.orders.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Orders ({searchResults.orders.length})
                      </div>
                      {searchResults.orders.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => {
                            onNavigateTab('orders');
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingCart className="w-4 h-4 text-emerald-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{o.id} – {o.customerName}</p>
                              <p className="text-xs text-slate-400">{o.items.length} items • {o.status}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-slate-800">
                            {data.settings.currency}{o.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.employees.length > 0 && (
                    <div>
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Employees ({searchResults.employees.length})
                      </div>
                      {searchResults.employees.map((e) => (
                        <div
                          key={e.id}
                          onClick={() => {
                            onNavigateTab('employees');
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <User className="w-4 h-4 text-purple-500" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{e.name}</p>
                              <p className="text-xs text-slate-400">{e.role} • {e.department}</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                            {e.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* AI Assistant Quick Toggle */}
        <button
          onClick={onToggleAssistant}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isAssistantOpen
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
              : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700'
          }`}
          title="Toggle AI Business Assistant"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">AI Assistant</span>
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-90 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 mt-0.5 shrink-0">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#0b1329] text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {data.settings.adminName ? data.settings.adminName[0].toUpperCase() : 'M'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {data.settings.adminName || 'Mounica'}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {data.settings.adminRole || 'Admin'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">{data.settings.adminName}</p>
                <p className="text-xs text-slate-400 truncate">{data.settings.adminEmail}</p>
              </div>
              <button
                onClick={() => {
                  onNavigateTab('settings');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                <span>Account & Settings</span>
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Reset all ERP data to initial clean demo state?')) {
                    await resetData();
                    setIsUserMenuOpen(false);
                  }
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Records</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  alert('Session logged out. You can sign back in as Administrator anytime.');
                  setIsUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
