import { Plus } from 'lucide-react';

interface AddTransactionFormProps {
  formData: {
    amount: string;
    type: 'income' | 'expense';
    category: string;
    note: string;
  };
  setFormData: (data: {
    amount: string;
    type: 'income' | 'expense';
    category: string;
    note: string;
  }) => void;
  onAdd: () => void;
  categories: string[];
}

export default function AddTransactionForm({ formData, setFormData, onAdd, categories }: AddTransactionFormProps) {
  return (
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
          onClick={onAdd}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm Giao Dịch
        </button>
      </div>
    </div>
  );
}