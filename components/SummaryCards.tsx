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
        className="relative bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/15 to-emerald-500/15 rounded-2xl"></div>

        <div className="relative z-10 flex items-center">
          <div className="relative">
            <TrendingUp className="h-10 w-10 text-emerald-400 drop-shadow-sm" />
            <div className="absolute inset-0 bg-emerald-300/20 blur-lg rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Tổng Thu Nhập</p>
            <motion.p
              className="text-2xl font-bold text-[#1e293b]"
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
        className="relative bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-300/15 to-rose-500/15 rounded-2xl"></div>

        <div className="relative z-10 flex items-center">
          <div className="relative">
            <TrendingDown className="h-10 w-10 text-rose-400 drop-shadow-sm" />
            <div className="absolute inset-0 bg-rose-300/20 blur-lg rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600">Tổng Chi Tiêu</p>
            <motion.p
              className="text-2xl font-bold text-[#1e293b]"
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