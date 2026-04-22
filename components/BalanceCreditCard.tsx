import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import CountUp from 'react-countup';

interface CreditCardProps {
  balance: number;
}

export default function BalanceCreditCard({ balance }: CreditCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{
        rotateY: 5,
        rotateX: 5,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: '1000px' }}
    >
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-6 rounded-2xl shadow-2xl transform-gpu"
           style={{
             background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
           }}>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>

        {/* Card content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/80 text-sm font-medium">Tổng Số Dư</p>
              <motion.p
                className="text-3xl font-bold text-white mt-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <CountUp end={balance} duration={2} separator="." /> VND
              </motion.p>
            </div>
            <CreditCard className="h-8 w-8 text-white/80" />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/60 text-xs">Expense Tracker</p>
              <p className="text-white/80 text-sm font-medium">•••• •••• •••• 4242</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Valid Thru</p>
              <p className="text-white/80 text-sm font-medium">12/28</p>
            </div>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 rounded-2xl"></div>
      </div>
    </motion.div>
  );
}