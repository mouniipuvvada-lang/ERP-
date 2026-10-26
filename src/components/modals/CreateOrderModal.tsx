import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { OrderItem } from '../../types';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
  const { data, createOrder } = useERP();
  const cur = data.settings.currency || '₹';

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Bank Transfer' | 'UPI' | 'Cash on Delivery'>('UPI');
  const [status, setStatus] = useState<'Completed' | 'Processing' | 'Pending'>('Completed');
  const [discount, setDiscount] = useState('0');
  const [notes, setNotes] = useState('');

  // Items in order
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: data.products[0]?.id || '',
      productName: data.products[0]?.name || '',
      category: data.products[0]?.category || 'Electronics',
      unitPrice: data.products[0]?.price || 0,
      quantity: 1,
      subtotal: data.products[0]?.price || 0,
    },
  ]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleProductSelect = (index: number, productId: string) => {
    const prod = data.products.find((p) => p.id === productId);
    if (!prod) return;

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        unitPrice: prod.price,
        quantity: Math.min(copy[index].quantity || 1, prod.quantity || 1),
        subtotal: prod.price * Math.min(copy[index].quantity || 1, prod.quantity || 1),
      };
      return copy;
    });
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const prod = data.products.find((p) => p.id === items[index].productId);
    const maxStock = prod ? prod.quantity : 999;
    const finalQty = Math.max(1, Math.min(qty, maxStock));

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        quantity: finalQty,
        subtotal: copy[index].unitPrice * finalQty,
      };
      return copy;
    });
  };

  const addItemRow = () => {
    // pick first product not yet in items or just first available
    const available = data.products.find((p) => !items.some((i) => i.productId === p.id)) || data.products[0];
    if (!available) return;

    setItems((prev) => [
      ...prev,
      {
        productId: available.id,
        productName: available.name,
        category: available.category,
        unitPrice: available.price,
        quantity: 1,
        subtotal: available.price,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = data.settings.taxRate || 18;
  const tax = Number(((subtotal * taxRate) / 100).toFixed(2));
  const discountVal = Number(discount) || 0;
  const total = Math.max(0, Number((subtotal + tax - discountVal).toFixed(2)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one item');
      return;
    }

    // Verify stock
    for (const item of items) {
      const prod = data.products.find((p) => p.id === item.productId);
      if (!prod) {
        setError(`Product ${item.productName} is missing`);
        return;
      }
      if (prod.quantity < item.quantity) {
        setError(`Insufficient inventory for "${prod.name}". Available: ${prod.quantity}, requested: ${item.quantity}`);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    const res = await createOrder({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || 'customer@example.com',
      customerPhone: customerPhone.trim(),
      items,
      subtotal,
      tax,
      discount: discountVal,
      total,
      status,
      paymentMethod,
      paymentStatus: status === 'Completed' ? 'Paid' : 'Pending',
      notes,
    });

    setIsSubmitting(false);

    if (res.success) {
      onClose();
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDiscount('0');
      setNotes('');
    } else {
      setError(res.error || 'Failed to create order');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Create New Customer Order</h3>
              <p className="text-xs text-slate-400">Inventory will update automatically upon completion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Items ({items.length})
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const selectedProd = data.products.find((p) => p.id === item.productId);
                const currentStock = selectedProd ? selectedProd.quantity : 0;

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl"
                  >
                    {/* Product select */}
                    <div className="flex-1 w-full sm:w-auto">
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                      >
                        {data.products.map((p) => (
                          <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                            {p.name} ({cur}{p.price}) – Stock: {p.quantity}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity with live stock constraint */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          max={currentStock}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value, 10) || 1)}
                          className="w-16 px-2 py-1 text-xs text-center bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-bold"
                        />
                      </div>

                      <div className="w-24 text-right">
                        <span className="text-xs font-bold text-slate-800">
                          {cur}{item.subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="UPI">UPI (Instant Verification)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Completed">Completed (Deduct Inventory Now)</option>
                  <option value="Processing">Processing (Reserve Stock)</option>
                  <option value="Pending">Pending (Draft Order)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Order Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery instructions, gift wrap, etc."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Calculations Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">
                  {cur}{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (GST {taxRate}%):</span>
                <span className="font-semibold text-slate-800">
                  {cur}{tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Discount ({cur}):</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 px-2 py-0.5 text-right text-xs bg-white border border-slate-200 rounded-md font-semibold"
                />
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-base text-indigo-700">
                  {cur}{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 rounded-xl shadow-md shadow-emerald-600/20 transition-all"
            >
              {isSubmitting ? 'Processing...' : 'Place Order & Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
