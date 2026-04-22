import { Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Lịch Sử Giao Dịch</h2>
        <div className="w-12 h-1 bg-indigo-500 mt-1"></div>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, backgroundColor: '#f9fafb' }}
            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors duration-200"
          >
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(transaction)}
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                <Edit className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(transaction.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash2 className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}