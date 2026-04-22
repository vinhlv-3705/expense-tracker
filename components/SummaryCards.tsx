import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export default function SummaryCards({ balance, totalIncome, totalExpense }: SummaryCardsProps) {
  return (
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
  );
}