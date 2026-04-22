'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2, Download } from 'lucide-react';

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
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 5000000, type: 'income', category: 'Khác', note: 'Lương tháng 4', date: '2024-04-01' },
    { id: '2', amount: 200000, type: 'expense', category: 'Ăn uống', note: 'Ăn trưa', date: '2024-04-02' },
    { id: '3', amount: 150000, type: 'expense', category: 'Di chuyển', note: 'Xăng xe', date: '2024-04-03' },
    { id: '4', amount: 1000000, type: 'income', category: 'Khác', note: 'Thưởng', date: '2024-04-05' },
    { id: '5', amount: 300000, type: 'expense', category: 'Mua sắm', note: 'Quần áo', date: '2024-04-07' },
  ]);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: categories[0],
    note: '',
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = categories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0),
  })).filter(item => item.value > 0);

  const addTransaction = () => {
    if (!formData.amount || !formData.note) return;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      note: formData.note,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ amount: '', type: 'expense', category: categories[0], note: '' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Chi Tiêu</h1>
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Số Dư</p>
                <p className="text-2xl font-bold text-gray-900">{balance.toLocaleString('vi-VN')} VND</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Thu Nhập</p>
                <p className="text-2xl font-bold text-gray-900">{totalIncome.toLocaleString('vi-VN')} VND</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Chi Tiêu</p>
                <p className="text-2xl font-bold text-gray-900">{totalExpense.toLocaleString('vi-VN')} VND</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Chi Tiêu Theo Danh Mục</h2>
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
          </div>

          {/* Add Transaction Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Thêm Giao Dịch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Số Tiền</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Nhập số tiền"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="income">Thu Nhập</option>
                  <option value="expense">Chi Tiêu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Danh Mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ghi Chú</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Nhập ghi chú"
                />
              </div>
              <button
                onClick={addTransaction}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm Giao Dịch
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold mb-4">Lịch Sử Giao Dịch</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Thu' : 'Chi'}
                    </span>
                    <span className="text-sm text-gray-500">{transaction.category}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{transaction.note}</p>
                  <p className="text-xs text-gray-500">{transaction.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} VND
                  </span>
                  <button
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
