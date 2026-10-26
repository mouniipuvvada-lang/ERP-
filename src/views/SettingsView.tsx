import React, { useState } from 'react';
import {
  Settings,
  Building,
  User,
  Bell,
  Shield,
  RotateCcw,
  Check,
  AlertTriangle,
  Cpu,
  Key,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SettingsView: React.FC = () => {
  const { data, updateSettings, resetData } = useERP();

  const [businessName, setBusinessName] = useState(data.settings.businessName);
  const [currency, setCurrency] = useState(data.settings.currency);
  const [lowStockThreshold, setLowStockThreshold] = useState(data.settings.lowStockThreshold.toString());
  const [taxRate, setTaxRate] = useState(data.settings.taxRate.toString());
  const [adminName, setAdminName] = useState(data.settings.adminName);
  const [adminEmail, setAdminEmail] = useState(data.settings.adminEmail);
  const [emailNotifications, setEmailNotifications] = useState(data.settings.emailNotifications);
  const [lowStockAlerts, setLowStockAlerts] = useState(data.settings.lowStockAlerts);
  const [orderAlerts, setOrderAlerts] = useState(data.settings.orderAlerts);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      businessName: businessName.trim(),
      currency,
      lowStockThreshold: Number(lowStockThreshold) || 15,
      taxRate: Number(taxRate) || 18,
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim(),
      emailNotifications,
      lowStockAlerts,
      orderAlerts,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all ERP records back to initial demo data (April 2025 baseline)?')) {
      await resetData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          <span>Application Settings & Configuration</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Manage company profile, currency units, inventory thresholds, and administrator credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Company & ERP Profile</h3>
              <p className="text-xs text-slate-400">Business registration and default invoicing rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company / Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD - US Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="¥">¥ (JPY - Japanese Yen)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Low-Stock Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Triggers warnings when stock drops below this count.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Standard GST / VAT applied on order checkout.</p>
            </div>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Administrator User Account</h3>
              <p className="text-xs text-slate-400">Current active session and dashboard greeting</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Display Name</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Alerts & Notifications</h3>
              <p className="text-xs text-slate-400">Configure business event triggers</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Low Stock Push Warnings</p>
                <p className="text-slate-400">Notify immediately when items fall below safe inventory counts</p>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(e) => setLowStockAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">High-Value Order Alerts</p>
                <p className="text-slate-400">Notify dashboard when customer orders exceed {currency} 5,000</p>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Executive Daily Summary Emails</p>
                <p className="text-slate-400">Send end-of-day sales reconciliation to admin inbox</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* AI & Integration Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Generative AI Assistant Configuration</h3>
              <p className="text-xs text-slate-400">Server-side Gemini 3.8 Flash execution</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-700">Model:</span>
              <span className="font-mono text-indigo-700 font-bold">gemini-3.8-flash</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-700">Architecture:</span>
              <span className="text-emerald-700 font-medium">Server-side proxy (`/api/ai/assistant`)</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-700">Database Binding:</span>
              <span className="text-indigo-700 font-medium">Verified Live Calculations (Zero guessing)</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 border-t border-indigo-100">
              Your API key is automatically configured via environment variables. When no external key is present, SmartERP seamlessly runs its local deterministic analytics engine.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetSuccess ? 'Restored Demo Data!' : 'Reset All Demo Data'}</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-98"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save System Settings</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
