import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function SummaryCards({ balance, totalIncome, totalExpense }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Income Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-xl"></div>

        <div className="relative z-10 flex items-center">
          <div className="relative">
            <TrendingUp className="h-10 w-10 text-emerald-500 drop-shadow-lg" />
            <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-700">Tổng Thu Nhập</p>
            <motion.p
              className="text-2xl font-bold text-slate-900"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <CountUp end={totalIncome} duration={2} separator="." /> VND
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Expense Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="relative bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-xl"></div>

        <div className="relative z-10 flex items-center">
          <div className="relative">
            <TrendingDown className="h-10 w-10 text-rose-500 drop-shadow-lg" />
            <div className="absolute inset-0 bg-rose-400/30 blur-xl rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-700">Tổng Chi Tiêu</p>
            <motion.p
              className="text-2xl font-bold text-slate-900"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <CountUp end={totalExpense} duration={2} separator="." /> VND
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}