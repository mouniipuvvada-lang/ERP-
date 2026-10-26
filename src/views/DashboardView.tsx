import React, { useState } from 'react';
import { Calendar, CreditCard, ShoppingCart, Package, Wallet } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { MetricCard } from '../components/MetricCard';
import { SalesChart } from '../components/SalesChart';
import { CategoryDonutChart } from '../components/CategoryDonutChart';
import {
  LowStockCard,
  RecentActivitiesCard,
  TopSellingCard,
  QuickActionsCard,
} from '../components/DashboardTables';
import { NavTab } from '../components/Sidebar';
import { AddProductModal } from '../components/modals/AddProductModal';
import { CreateOrderModal } from '../components/modals/CreateOrderModal';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenAssistant,
}) => {
  const { data, metrics } = useERP();
  const cur = data.settings.currency || '₹';

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Good Morning, {data.settings.adminName || 'Mounica'}!</span>
            <span>👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Date Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>28 April 2025</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          title="Total Sales"
          value={`${cur} ${metrics.totalSales.toLocaleString('en-IN')}`}
          trendText="12% vs. last month"
          isPositive={true}
          icon={CreditCard}
          variant="blue"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.totalOrders.toString()}
          trendText="8% vs. last month"
          isPositive={true}
          icon={ShoppingCart}
          variant="green"
        />
        <MetricCard
          title="Total Products"
          value={metrics.totalProductsInStock.toString()}
          trendText="5% in stock"
          isPositive={true}
          icon={Package}
          variant="coral"
        />
        <MetricCard
          title="Total Expenses"
          value={`${cur} ${metrics.totalExpenses.toLocaleString('en-IN')}`}
          trendText="3% vs. last month"
          isPositive={false}
          icon={Wallet}
          variant="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <SalesChart />
        </div>
        <div className="lg:col-span-5">
          <CategoryDonutChart />
        </div>
      </div>

      {/* 4 Bottom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <LowStockCard onNavigateTab={onNavigateTab} />
        <RecentActivitiesCard onNavigateTab={onNavigateTab} />
        <TopSellingCard onNavigateTab={onNavigateTab} />
        <QuickActionsCard
          onNavigateTab={onNavigateTab}
          onOpenAddProduct={() => setIsAddProductOpen(true)}
          onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
          onOpenAssistant={onOpenAssistant}
        />
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
      />
    </div>
  );
};
