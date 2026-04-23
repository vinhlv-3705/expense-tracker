import { Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  isDark?: boolean;
}

export default function TransactionList({
  transactions,
  onDelete,
  onEdit,
  isDark = false,
}: TransactionListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={`backdrop-blur-xl p-8 rounded-2xl border mt-8 ${isDark ? 'bg-slate-900/45 border-slate-700/60 shadow-[0_12px_35px_rgba(2,6,23,0.55)]' : 'bg-white/40 border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
    >
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-[#1e293b]'}`}>Lịch Sử Giao Dịch</h2>
        <div className={`w-12 h-1 mt-2 rounded-full ${isDark ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{
              scale: 1.015,
              y: -2,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            className={`group relative backdrop-blur-md p-6 rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden shadow-sm ${isDark ? 'bg-slate-900/35 border-slate-700/60 hover:shadow-[0_6px_22px_rgba(2,6,23,0.45)]' : 'bg-white/35 border-white/60 hover:shadow-[0_6px_22px_rgb(0,0,0,0.08)]'}`}
          >
            {/* Hover background effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-cyan-400/10' : 'bg-gradient-to-r from-blue-50/40 to-cyan-50/40'}`}></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <motion.span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === "income"
                        ? "bg-emerald-100 text-emerald-800 shadow-emerald-200/50"
                        : "bg-rose-100 text-rose-800 shadow-rose-200/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {transaction.type === "income" ? "Thu" : "Chi"}
                  </motion.span>
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {transaction.category}
                  </span>
                </div>
                <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {transaction.note}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{transaction.date}</p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.span
                  className={`text-2xl font-extrabold tracking-tight tabular-nums ${
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {transaction.amount.toLocaleString("vi-VN")} VND
                </motion.span>

                {/* Action buttons - hidden by default, show on hover */}
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(transaction)}
                    className="p-2 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                    }}
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
