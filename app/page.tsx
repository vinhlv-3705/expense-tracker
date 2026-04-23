// Updated page.tsx with Glassmorphism UI
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileDown, DollarSign, Plus, Search, Calendar, Filter, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import EditTransactionModal from '../components/EditTransactionModal';
import TransactionList from '../components/TransactionList';
import BalanceCreditCard from '../components/BalanceCreditCard';
import SummaryCards from '../components/SummaryCards';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  date: string;
}

const categories = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Khác'];
const colors = ['#1d4ed8', '#0ea5e9', '#06b6d4', '#38bdf8', '#3b82f6'];
const defaultTransactions: Transaction[] = [
  { id: '1', amount: 5000000, type: 'income', category: 'Khác', note: 'Lương tháng 4', date: '2024-04-01' },
  { id: '2', amount: 200000, type: 'expense', category: 'Ăn uống', note: 'Ăn trưa', date: '2024-04-02' },
  { id: '3', amount: 150000, type: 'expense', category: 'Di chuyển', note: 'Xăng xe', date: '2024-04-03' },
  { id: '4', amount: 1000000, type: 'income', category: 'Khác', note: 'Thưởng', date: '2024-04-05' },
  { id: '5', amount: 300000, type: 'expense', category: 'Mua sắm', note: 'Quần áo', date: '2024-04-07' },
];

export default function Dashboard() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const savedTheme = localStorage.getItem('expense-tracker-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? savedTheme === 'dark' : prefersDark;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === 'undefined') {
      return defaultTransactions;
    }

    const savedTransactions = localStorage.getItem('expense-tracker-transactions');
    if (!savedTransactions) {
      return defaultTransactions;
    }

    try {
      const parsed: Transaction[] = JSON.parse(savedTransactions);
      return parsed.length > 0 ? parsed : defaultTransactions;
    } catch (error) {
      console.error('Error loading transactions from localStorage:', error);
      return defaultTransactions;
    }
  });
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: categories[0],
    note: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [monthFilter, setMonthFilter] = useState<{ month: number | null, year: number }>({ month: null, year: new Date().getFullYear() });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('expense-tracker-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const transactionDate = new Date(t.date);
      const matchesMonth = monthFilter.month === null ||
        (transactionDate.getMonth() === monthFilter.month - 1 && transactionDate.getFullYear() === monthFilter.year);
      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [transactions, searchTerm, categoryFilter, monthFilter]);

  const expenseByCategory = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const existing = acc.find(item => item.name === t.category);
        if (existing) {
          existing.value += t.amount;
        } else {
          acc.push({ name: t.category, value: t.amount });
        }
        return acc;
      }, [] as { name: string; value: number }[])
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const addTransaction = () => {
    const amount = parseFloat(formData.amount);
    if (!formData.amount.trim() || !formData.note.trim() || isNaN(amount) || amount <= 0) return;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: amount,
      type: formData.type,
      category: formData.category,
      note: formData.note.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: '', type: 'expense', category: categories[0], note: '' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const onEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const onSaveEdit = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const onCloseEdit = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Note'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        t.date,
        t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
        t.category,
        t.amount.toString(),
        `"${t.note}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-10"
        >
          <h1 className={`text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent tracking-tight ${isDark ? 'from-sky-200 via-blue-300 to-cyan-300' : 'from-blue-800 via-sky-700 to-cyan-600'}`}>
            Dashboard Chi Tiêu
          </h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsDark((prev) => !prev)}
              className={`h-12 w-12 rounded-2xl border backdrop-blur-xl flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-sky-200 focus:ring-sky-400' : 'bg-white/50 border-white/70 text-blue-700 focus:ring-blue-400'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: isDark ? '0 14px 24px -10px rgba(56, 189, 248, 0.45)' : '0 14px 24px -10px rgba(37, 99, 235, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={exportToCSV}
              className={`text-white px-6 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-sky-500 to-blue-600 focus:ring-sky-400 focus:ring-offset-slate-950' : 'bg-gradient-to-r from-blue-700 to-sky-600 focus:ring-blue-500 focus:ring-offset-slate-100'}`}
            >
              <FileDown className="h-5 w-5 mr-2" />
              Export CSV
            </motion.button>
          </div>
        </motion.div>

        <>
            {/* Balance Credit Card */}
            <div className="mb-10">
              <BalanceCreditCard balance={balance} isDark={isDark} />
            </div>

            {/* Summary Cards */}
            <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} isDark={isDark} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`backdrop-blur-xl p-8 rounded-2xl border ${isDark ? 'bg-slate-900/45 border-slate-700/60 shadow-[0_12px_35px_rgba(2,6,23,0.55)]' : 'bg-white/40 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
              >
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1e293b]'}`}>Chi Tiêu Theo Danh Mục</h2>
                  <div className={`w-12 h-1 mt-2 rounded-full ${isDark ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Add Transaction Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`backdrop-blur-xl p-8 rounded-2xl border ${isDark ? 'bg-slate-900/45 border-slate-700/60 shadow-[0_12px_35px_rgba(2,6,23,0.55)]' : 'bg-white/40 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
              >
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1e293b]'}`}>Thêm Giao Dịch</h2>
                  <div className={`w-12 h-1 mt-2 rounded-full ${isDark ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700">Số Tiền</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="mt-1 block w-full h-11 pl-11 pr-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900 placeholder-slate-500"
                        placeholder="Nhập số tiền"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Loại</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                      className="mt-1 block w-full h-11 px-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900"
                    >
                      <option value="income">Thu Nhập</option>
                      <option value="expense">Chi Tiêu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Danh Mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full h-11 px-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700">Ghi Chú</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="mt-1 block w-full h-11 pl-11 pr-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900 placeholder-slate-500"
                        placeholder="Nhập ghi chú"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addTransaction}
                    disabled={!formData.amount.trim() || !formData.note.trim() || parseFloat(formData.amount) <= 0}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Thêm Giao Dịch
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -2 }}
              className={`backdrop-blur-xl p-8 rounded-2xl border mt-8 ${isDark ? 'bg-slate-900/45 border-slate-700/60 shadow-[0_12px_35px_rgba(2,6,23,0.55)]' : 'bg-white/40 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
            >
              <div className="mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1e293b]'}`}>Công Cụ Lọc</h2>
                <div className={`w-12 h-1 mt-2 rounded-full ${isDark ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>
              </div>
              <div className="flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tìm Kiếm Theo Ghi Chú</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full h-11 pl-11 pr-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900 placeholder-slate-500"
                      placeholder="Nhập từ khóa..."
                    />
                  </div>
                </div>
                <div className="flex gap-4 items-end">
                  <div className="min-w-40">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tháng</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <select
                        value={monthFilter.month ?? ''}
                        onChange={(e) => setMonthFilter({ ...monthFilter, month: e.target.value ? parseInt(e.target.value) : null })}
                        className="block w-full h-11 pl-11 pr-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900"
                      >
                        <option value="">Tất Cả</option>
                        {[...Array(12)].map((_, i) => {
                          const monthNum = i + 1;
                          return <option key={monthNum} value={monthNum}>Tháng {monthNum}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="min-w-40">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Năm</label>
                    <div className="relative">
                      <select
                        value={monthFilter.year}
                        onChange={(e) => setMonthFilter({ ...monthFilter, year: parseInt(e.target.value) })}
                        className="block w-full h-11 px-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900"
                      >
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="min-w-48">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Lọc Theo Danh Mục</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="block w-full h-11 pl-11 pr-3 rounded-lg border border-white/50 bg-white/30 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-white/70 transition-all text-slate-900"
                    >
                      <option value="all">Tất Cả</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} onEdit={onEdit} isDark={isDark} />
            </motion.div>

            <EditTransactionModal
              key={editingTransaction?.id ?? 'new'}
              transaction={editingTransaction}
              categories={categories}
              onSave={onSaveEdit}
              onClose={onCloseEdit}
              isOpen={showEditModal}
            />
        </>
      </div>
    </div>
  );
}
