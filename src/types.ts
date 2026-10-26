export type ProductCategory = 
  | 'Electronics'
  | 'Clothing'
  | 'Home & Living'
  | 'Beauty & Health'
  | 'Others';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  quantity: number;
  lowStockThreshold: number;
  description: string;
  unitsSold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl?: string;
  updatedAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'UPI' | 'Cash on Delivery' | 'PayPal';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  createdAt: string;
  notes?: string;
}

export type Department = 
  | 'Engineering'
  | 'Sales'
  | 'Marketing'
  | 'Finance'
  | 'Human Resources'
  | 'Operations'
  | 'Customer Support';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  joiningDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar?: string;
}

export type ExpenseCategory = 
  | 'Rent'
  | 'Utilities'
  | 'Payroll'
  | 'Marketing'
  | 'Supplies'
  | 'Software'
  | 'Logistics'
  | 'Maintenance'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Credit Card' | 'UPI' | 'Corporate Card' | 'Cash';
  description: string;
  status: 'Paid' | 'Pending Approval';
}

export interface Activity {
  id: string;
  type: 'order' | 'product' | 'employee' | 'payment' | 'stock' | 'expense' | 'system';
  title: string;
  timestamp: string;
  relativeTime?: string;
  details?: string;
}

export interface AppSettings {
  businessName: string;
  currency: string;
  currencyCode: string;
  lowStockThreshold: number;
  taxRate: number;
  emailNotifications: boolean;
  lowStockAlerts: boolean;
  orderAlerts: boolean;
  adminName: string;
  adminEmail: string;
  adminRole: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isReport?: boolean;
  reportData?: {
    title: string;
    totalSales: number;
    salesGrowth: string;
    totalOrders: number;
    ordersGrowth: string;
    topProduct: string;
    totalExpenses: number;
    expenseGrowth: string;
    reportDate: string;
  };
}

export interface ERPData {
  products: Product[];
  orders: Order[];
  employees: Employee[];
  expenses: Expense[];
  activities: Activity[];
  settings: AppSettings;
}
