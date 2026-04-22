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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mt-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1e293b]">Lịch Sử Giao Dịch</h2>
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mt-2 rounded-full"></div>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              y: -2,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            className="group relative bg-white/30 backdrop-blur-md p-5 rounded-xl border border-white/50 cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-[0_4px_20px_rgb(0,0,0,0.08)]"
          >
            {/* Hover background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <motion.span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800 shadow-emerald-200/50'
                        : 'bg-rose-100 text-rose-800 shadow-rose-200/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {transaction.type === 'income' ? 'Thu' : 'Chi'}
                  </motion.span>
                  <span className="text-sm text-slate-600 font-medium">{transaction.category}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">{transaction.note}</p>
                <p className="text-xs text-slate-500">{transaction.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.span
                  className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                >
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} VND
                </motion.span>

                {/* Action buttons - hidden by default, show on hover */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(transaction)}
                    className="p-2 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}