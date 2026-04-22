'use client';

import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileDown, DollarSign, TrendingUp, TrendingDown, Trash2, Plus, Search, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import EditTransactionModal from '../components/EditTransactionModal';
import TransactionList from '../components/TransactionList';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  date: string;
}

const categories = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Khác'];
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: categories[0],
    note: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [monthFilter, setMonthFilter] = useState<'all' | 'current' | 'previous'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTransactions = localStorage.getItem('expense-tracker-transactions');
      if (savedTransactions) {
        try {
          const parsed = JSON.parse(savedTransactions);
          if (parsed.length > 0) {
            setTransactions(parsed);
          } else {
            // Use default data if empty
            setTransactions([
              { id: '1', amount: 5000000, type: 'income', category: 'Khác', note: 'Lương tháng 4', date: '2024-04-01' },
              { id: '2', amount: 200000, type: 'expense', category: 'Ăn uống', note: 'Ăn trưa', date: '2024-04-02' },
              { id: '3', amount: 150000, type: 'expense', category: 'Di chuyển', note: 'Xăng xe', date: '2024-04-03' },
              { id: '4', amount: 1000000, type: 'income', category: 'Khác', note: 'Thưởng', date: '2024-04-05' },
              { id: '5', amount: 300000, type: 'expense', category: 'Mua sắm', note: 'Quần áo', date: '2024-04-07' },
            ]);
          }
        } catch (error) {
          console.error('Error loading transactions from localStorage:', error);
          setTransactions([
            { id: '1', amount: 5000000, type: 'income', category: 'Khác', note: 'Lương tháng 4', date: '2024-04-01' },
            { id: '2', amount: 200000, type: 'expense', category: 'Ăn uống', note: 'Ăn trưa', date: '2024-04-02' },
            { id: '3', amount: 150000, type: 'expense', category: 'Di chuyển', note: 'Xăng xe', date: '2024-04-03' },
            { id: '4', amount: 1000000, type: 'income', category: 'Khác', note: 'Thưởng', date: '2024-04-05' },
            { id: '5', amount: 300000, type: 'expense', category: 'Mua sắm', note: 'Quần áo', date: '2024-04-07' },
          ]);
        }
      } else {
        setTransactions([
          { id: '1', amount: 5000000, type: 'income', category: 'Khác', note: 'Lương tháng 4', date: '2024-04-01' },
          { id: '2', amount: 200000, type: 'expense', category: 'Ăn uống', note: 'Ăn trưa', date: '2024-04-02' },
          { id: '3', amount: 150000, type: 'expense', category: 'Di chuyển', note: 'Xăng xe', date: '2024-04-03' },
          { id: '4', amount: 1000000, type: 'income', category: 'Khác', note: 'Thưởng', date: '2024-04-05' },
          { id: '5', amount: 300000, type: 'expense', category: 'Mua sắm', note: 'Quần áo', date: '2024-04-07' },
        ]);
      }
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (hasLoaded && transactions.length > 0) {
      localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions));
    }
  }, [transactions, hasLoaded]);

  const totalIncome = useMemo(() => transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const totalExpense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [transactions]);
  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const now = new Date();
      const transactionDate = new Date(t.date);
      const matchesMonth = monthFilter === 'all' ||
        (monthFilter === 'current' && transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()) ||
        (monthFilter === 'previous' && (
          (transactionDate.getMonth() === now.getMonth() - 1 && transactionDate.getFullYear() === now.getFullYear()) ||
          (now.getMonth() === 0 && transactionDate.getMonth() === 11 && transactionDate.getFullYear() === now.getFullYear() - 1)
        ));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Chi Tiêu</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center transition-colors duration-200"
          >
            <FileDown className="h-5 w-5 mr-2" />
            Export CSV
          </motion.button>
        </motion.div>

        {hasLoaded ? (
          <>
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500"
              >
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng Số Dư</p>
                    <p className="text-3xl font-bold text-gray-900">{balance.toLocaleString('vi-VN')} VND</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500"
              >
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng Thu Nhập</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalIncome.toLocaleString('vi-VN')} VND</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500"
              >
                <div className="flex items-center">
                  <TrendingDown className="h-8 w-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tổng Chi Tiêu</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalExpense.toLocaleString('vi-VN')} VND</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Chi Tiêu Theo Danh Mục</h2>
                  <div className="w-12 h-1 bg-indigo-500 mt-1"></div>
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
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Thêm Giao Dịch</h2>
                  <div className="w-12 h-1 bg-indigo-500 mt-1"></div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800">Số Tiền</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="mt-1 block w-full h-11 pl-11 pr-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                        placeholder="Nhập số tiền"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">Loại</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                      className="mt-1 block w-full h-11 px-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                    >
                      <option value="income">Thu Nhập</option>
                      <option value="expense">Chi Tiêu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">Danh Mục</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 block w-full h-11 px-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-800">Ghi Chú</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="mt-1 block w-full h-11 pl-11 pr-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                        placeholder="Nhập ghi chú"
                      />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addTransaction}
                    disabled={!formData.amount.trim() || !formData.note.trim() || parseFloat(formData.amount) <= 0}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
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
              className="bg-white p-6 rounded-lg shadow-md mt-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Công Cụ Lọc</h2>
                <div className="w-12 h-1 bg-indigo-500 mt-1"></div>
              </div>
              <div className="flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-64">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Tìm Kiếm Theo Ghi Chú</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full h-11 pl-11 pr-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                      placeholder="Nhập từ khóa..."
                    />
                  </div>
                </div>
                <div className="min-w-48">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Lọc Theo Tháng</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value as 'all' | 'current' | 'previous')}
                      className="block w-full h-11 pl-11 pr-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
                    >
                      <option value="all">Tất Cả</option>
                      <option value="current">Tháng Này</option>
                      <option value="previous">Tháng Trước</option>
                    </select>
                  </div>
                </div>
                <div className="min-w-48">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Lọc Theo Danh Mục</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="block w-full h-11 pl-11 pr-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
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
              <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} onEdit={onEdit} />
            </motion.div>

            <EditTransactionModal
              transaction={editingTransaction}
              categories={categories}
              onSave={onSaveEdit}
              onClose={onCloseEdit}
              isOpen={showEditModal}
            />
          </>
        ) : (
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
