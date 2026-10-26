import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Download,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Check,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { ChatMessage } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  isFullPage = false,
}) => {
  const { data, metrics } = useERP();
  const cur = data.settings.currency || '₹';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'user',
      content: 'How many products are available in stock?',
      timestamp: '10:24 AM',
    },
    {
      id: 'm-2',
      role: 'assistant',
      content: `There are **${metrics.totalProductsInStock} products available in stock** across all categories.\n\n` +
        `• Electronics: **${metrics.categoryCounts['Electronics'] || 184}**\n` +
        `• Clothing: **${metrics.categoryCounts['Clothing'] || 138}**\n` +
        `• Home & Living: **${metrics.categoryCounts['Home & Living'] || 102}**\n` +
        `• Beauty & Health: **${metrics.categoryCounts['Beauty & Health'] || 85}**\n` +
        `• Others: **${metrics.categoryCounts['Others'] || 63}**`,
      timestamp: '10:24 AM',
    },
    {
      id: 'm-3',
      role: 'user',
      content: "What are this month's total sales?",
      timestamp: '10:25 AM',
    },
    {
      id: 'm-4',
      role: 'assistant',
      content: `This month's total sales are **${cur} ${metrics.totalSales.toLocaleString('en-IN')}**.\n\n` +
        `This is **12% higher** than last month (${cur} 2,21,320).`,
      timestamp: '10:25 AM',
    },
    {
      id: 'm-5',
      role: 'user',
      content: 'Generate a monthly business report.',
      timestamp: '10:26 AM',
    },
    {
      id: 'm-6',
      role: 'assistant',
      content: 'Here is your monthly executive performance summary:',
      timestamp: '10:26 AM',
      isReport: true,
      reportData: {
        title: 'Monthly Business Report – April 2025',
        totalSales: metrics.totalSales,
        salesGrowth: '↑ 12%',
        totalOrders: metrics.totalOrders,
        ordersGrowth: '↑ 8%',
        topProduct: metrics.topSellingProducts[0]?.name || 'Smart Watch',
        totalExpenses: metrics.totalExpenses,
        expenseGrowth: '↓ 3%',
        reportDate: '28 April 2025',
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'How many products are currently in stock?',
    "What are this month's total sales?",
    'Which products are running low?',
    "What are this month's expenses?",
    'Which products are selling the most?',
    'Summarize recent business activities.',
    'Generate a monthly business report.',
    "Compare this month's sales with last month's sales.",
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.content,
          })),
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: json.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isReport: json.isReport,
          reportData: json.reportData,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Server returned error');
      }
    } catch {
      // Offline / fallback calculation
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed the live records in SmartERP. Currently:\n\n` +
          `• Total stock: **${metrics.totalProductsInStock} units**\n` +
          `• Total sales: **${cur} ${metrics.totalSales.toLocaleString('en-IN')}**\n` +
          `• Total expenses: **${cur} ${metrics.totalExpenses.toLocaleString('en-IN')}**\n` +
          `• Low stock items: **${metrics.lowStockCount} products**`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (rep: NonNullable<ChatMessage['reportData']>) => {
    const csvContent =
      `SmartERP Executive Monthly Report\n` +
      `Date,${rep.reportDate}\n` +
      `Total Sales,${cur} ${rep.totalSales.toLocaleString('en-IN')},${rep.salesGrowth}\n` +
      `Total Orders,${rep.totalOrders},${rep.ordersGrowth}\n` +
      `Top Selling Product,${rep.topProduct}\n` +
      `Total Expenses,${cur} ${rep.totalExpenses.toLocaleString('en-IN')},${rep.expenseGrowth}\n\n` +
      `Generated by SmartERP AI Assistant`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SmartERP_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  if (!isOpen && !isFullPage) return null;

  return (
    <aside
      className={`${
        isFullPage
          ? 'w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200'
          : 'fixed top-0 bottom-0 right-0 z-50 w-full sm:w-105 bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-all'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              AI Business Assistant
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-slate-500 font-medium">Online</span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-indigo-600 font-medium">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([])}
            title="Clear Chat History"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {!isFullPage && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Suggestions Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.slice(0, 4).map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="shrink-0 px-2.5 py-1 text-[11px] font-medium bg-white text-slate-600 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all text-left truncate max-w-56"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Bot className="w-12 h-12 text-indigo-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-700">How can I help you today?</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Ask questions about sales, inventory levels, expenses, team, or generate instant reports.
            </p>
            <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
              {quickPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="p-2 text-xs bg-white border border-slate-200 rounded-xl text-left text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors font-medium shadow-2xs"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`flex gap-2.5 max-w-[90%] sm:max-w-[85%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {!isUser ? (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">
                      {msg.content}
                    </div>

                    {/* Report Card */}
                    {msg.isReport && msg.reportData && (
                      <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                          <span className="font-bold text-xs text-indigo-700">
                            {msg.reportData.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {msg.reportData.reportDate}
                          </span>
                        </div>
                        <ul className="text-xs space-y-1.5 text-slate-600">
                          <li className="flex items-center justify-between">
                            <span>• Total Sales:</span>
                            <span className="font-bold text-slate-800">
                              {cur} {msg.reportData.totalSales.toLocaleString('en-IN')}{' '}
                              <span className="text-emerald-600 font-semibold text-[11px]">
                                ({msg.reportData.salesGrowth})
                              </span>
                            </span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>• Total Orders:</span>
                            <span className="font-bold text-slate-800">
                              {msg.reportData.totalOrders}{' '}
                              <span className="text-emerald-600 font-semibold text-[11px]">
                                ({msg.reportData.ordersGrowth})
                              </span>
                            </span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>• Top Selling Product:</span>
                            <span className="font-bold text-slate-800">
                              {msg.reportData.topProduct}
                            </span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span>• Total Expenses:</span>
                            <span className="font-bold text-slate-800">
                              {cur} {msg.reportData.totalExpenses.toLocaleString('en-IN')}{' '}
                              <span className="text-emerald-600 font-semibold text-[11px]">
                                ({msg.reportData.expenseGrowth})
                              </span>
                            </span>
                          </li>
                        </ul>

                        <button
                          onClick={() => handleDownloadReport(msg.reportData!)}
                          className="w-full mt-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          {downloadSuccess ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Downloaded!</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Report</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-10">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>Analyzing enterprise business records...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your business..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white transition-all shadow-md shadow-indigo-600/20 disabled:shadow-none active:scale-95"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
