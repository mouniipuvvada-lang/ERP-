import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { Order, OrderStatus } from '../types';
import { CreateOrderModal } from '../components/modals/CreateOrderModal';

export const OrdersView: React.FC = () => {
  const { data, updateOrderStatus, deleteOrder } = useERP();
  const cur = data.settings.currency || '₹';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = data.orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const completedRevenue = data.orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <span>Sales & Orders Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Process incoming orders, track fulfillment states, generate invoices, and manage revenue.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Total Orders Placed</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{data.orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Completed Revenue</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">
            {cur} {completedRevenue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Processing / In Transit</p>
          <p className="text-xl font-extrabold text-blue-600 mt-1">
            {data.orders.filter((o) => o.status === 'Processing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs">
          <p className="text-xs font-semibold text-slate-400">Pending Approval</p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">
            {data.orders.filter((o) => o.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none"
          >
            <option value="All">All Order Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-indigo-700">
                      {o.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{o.customerName}</p>
                      <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="font-semibold">{o.items.length} item(s)</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-40">
                        {o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{o.paymentMethod}</span>
                      <p className="text-[10px] text-slate-400">({o.paymentStatus})</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                      {cur} {o.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className={`appearance-none text-[11px] font-bold py-1 pl-2.5 pr-6 rounded-lg cursor-pointer focus:outline-none ${getStatusBadge(
                            o.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Order Details & Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Delete order ${o.id}?`)) {
                              await deleteOrder(o.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* View Invoice / Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-800">
                  Order Invoice: {selectedOrder.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Header metadata */}
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="font-bold text-sm text-slate-800">{data.settings.businessName}</p>
                  <p className="text-slate-400">SmartERP System Generated Invoice</p>
                  <p className="text-slate-400 mt-1">Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                  <p className="text-slate-500 mt-1 font-medium">{selectedOrder.paymentMethod} • {selectedOrder.paymentStatus}</p>
                </div>
              </div>

              {/* Customer Box */}
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed To:</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-slate-500">{selectedOrder.customerEmail}</p>
                {selectedOrder.customerPhone && <p className="text-slate-500">{selectedOrder.customerPhone}</p>}
                {selectedOrder.notes && (
                  <p className="mt-2 text-indigo-600 italic">Notes: {selectedOrder.notes}</p>
                )}
              </div>

              {/* Items Breakdown */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2">Item Description</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Unit Price</th>
                    <th className="pb-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2.5 font-semibold text-slate-800">{item.productName}</td>
                      <td className="py-2.5 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-2.5 text-right text-slate-600">{cur} {item.unitPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right font-bold text-slate-800">{cur} {item.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{cur} {selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({data.settings.taxRate}%):</span>
                  <span>{cur} {selectedOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>- {cur} {selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Paid:</span>
                  <span className="text-indigo-700 text-base">{cur} {selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
