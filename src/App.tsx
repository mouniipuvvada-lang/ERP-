import React, { useState } from 'react';
import { ERPProvider } from './context/ERPContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { DashboardView } from './views/DashboardView';
import { EmployeesView } from './views/EmployeesView';
import { ProductsView } from './views/ProductsView';
import { OrdersView } from './views/OrdersView';
import { ExpensesView } from './views/ExpensesView';
import { ReportsView } from './views/ReportsView';
import { AIAssistantView } from './views/AIAssistantView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigateTab={setCurrentTab}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
      case 'employees':
        return <EmployeesView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'assistant':
        return <AIAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onNavigateTab={setCurrentTab}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        );
    }
  };

  const isDashboard = currentTab === 'dashboard';

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800">
      {/* 1. Left Navy Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleAssistant={() => setIsAssistantOpen(!isAssistantOpen)}
          isAssistantOpen={isAssistantOpen}
          onNavigateTab={setCurrentTab}
        />

        {/* Workspace body */}
        <div className="flex-1 flex min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderActiveView()}
          </main>

          {/* 3. Right AI Assistant Panel on Desktop Dashboard */}
          {isDashboard && isAssistantOpen && (
            <div className="hidden xl:block w-96 shrink-0 p-6 pl-0">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
                <AIAssistantDrawer
                  isOpen={true}
                  onClose={() => setIsAssistantOpen(false)}
                  isFullPage={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile / Non-Dashboard Slide-over AI Assistant Drawer */}
      {(!isDashboard || !isAssistantOpen || window.innerWidth < 1280) && (
        <AIAssistantDrawer
          isOpen={isAssistantOpen && (!isDashboard || window.innerWidth < 1280)}
          onClose={() => setIsAssistantOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}
