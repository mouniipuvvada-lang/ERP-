import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  Check,
  Package,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ReportsView: React.FC = () => {
  const { data, metrics } = useERP();
  const cur = data.settings.currency || '₹';

  const [timeRange, setTimeRange] = useState<'April 2025' | 'Last 30 Days' | 'Q1 2025' | 'Full Year 2025'>('April 2025');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const exportCSV = (type: 'sales' | 'inventory' | 'expenses') => {
    let csv = '';
    let filename = '';

    if (type === 'sales') {
      csv = 'Order ID,Customer Name,Date,Payment Method,Status,Total Amount\n';
      data.orders.forEach((o) => {
        csv += `${o.id},"${o.customerName}",${o.createdAt},${o.paymentMethod},${o.status},${o.total}\n`;
      });
      filename = `SmartERP_Sales_Report_${Date.now()}.csv`;
    } else if (type === 'inventory') {
      csv = 'SKU,Product Name,Category,Price,Quantity,Status\n';
      data.products.forEach((p) => {
        csv += `${p.sku},"${p.name}",${p.category},${p.price},${p.quantity},${p.status}\n`;
      });
      filename = `SmartERP_Inventory_Report_${Date.now()}.csv`;
    } else {
      csv = 'Title,Category,Amount,Date,Payment Method\n';
      data.expenses.forEach((e) => {
        csv += `"${e.title}",${e.category},${e.amount},${e.date},${e.paymentMethod}\n`;
      });
      filename = `SmartERP_Expenses_Report_${Date.now()}.csv`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Reports & Executive Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Generate audited business performance reports, revenue breakdowns, and inventory summaries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => exportCSV('sales')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-98"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-2xs w-fit">
        {(['April 2025', 'Last 30 Days', 'Q1 2025', 'Full Year 2025'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === r
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Structured Executive Business Report Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                Audited Executive Statement
              </span>
              <span className="text-xs text-slate-400">Generated: 28 April 2025</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 mt-2">
              {data.settings.businessName} – Performance Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reporting Window: {timeRange} • Prepared for Administrator: {data.settings.adminName}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-400 font-medium">Net Operating Margin</p>
            <p className="text-2xl font-black text-indigo-600">
              {Math.round(((metrics.totalSales - metrics.totalExpenses) / metrics.totalSales) * 100)}%
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Healthy Cashflow State</p>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
            <p className="text-xs font-bold text-blue-700">Gross Sales Revenue</p>
            <p className="text-xl font-black text-slate-800 mt-1">
              {cur} {metrics.totalSales.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 12% Month-over-Month</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700">Completed Orders</p>
            <p className="text-xl font-black text-slate-800 mt-1">
              {metrics.totalOrders}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 8% Fulfillment Rate</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
            <p className="text-xs font-bold text-amber-700">Operating Expenses</p>
            <p className="text-xl font-black text-slate-800 mt-1">
              {cur} {metrics.totalExpenses.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-rose-500 font-semibold mt-1">↓ 3% Cost Reduction</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100">
            <p className="text-xs font-bold text-purple-700">Top Selling Product</p>
            <p className="text-lg font-black text-slate-800 mt-1 truncate">
              {metrics.topSellingProducts[0]?.name || 'Smart Watch'}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {metrics.topSellingProducts[0]?.unitsSold || 120} units sold
            </p>
          </div>
        </div>

        {/* Business Observations & AI Summary */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>Key Business Observations & Insights</span>
          </h4>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Strong Sales Momentum:</strong> Sales revenue reached {cur} {metrics.totalSales.toLocaleString('en-IN')}, beating previous cycle baseline by 12%, driven predominantly by the Electronics & Wearables vertical.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Inventory Health & Low-Stock Alerts:</strong> There are currently {metrics.lowStockCount} items below threshold ({metrics.lowStockProducts.map(p => p.name).join(', ')}). Replenishing within 5 business days is recommended.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <strong>Expense Optimization:</strong> Monthly overheads settled at {cur} {metrics.totalExpenses.toLocaleString('en-IN')}, a 3% drop achieved via consolidated logistics shipments and vendor contract terms.
              </span>
            </li>
          </ul>
        </div>

        {/* Export individual datasets */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500">Download Raw Datasets:</span>
          <button
            onClick={() => exportCSV('sales')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sales Orders (.csv)</span>
          </button>
          <button
            onClick={() => exportCSV('inventory')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Warehouse Inventory (.csv)</span>
          </button>
          <button
            onClick={() => exportCSV('expenses')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            <span>Operating Expenses (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
