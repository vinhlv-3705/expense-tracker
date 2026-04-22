import { Plus, Save } from 'lucide-react';

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
  isEditing?: boolean;
  onSave?: () => void;
}

export default function AddTransactionForm({ formData, setFormData, onAdd, categories, isEditing = false, onSave }: AddTransactionFormProps) {
  return (
    <div className={isEditing ? "" : "bg-white p-6 rounded-lg shadow-md"}>
      {!isEditing && <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập Nhật Giao Dịch' : 'Thêm Giao Dịch'}</h2>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">Số Tiền</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full h-11 px-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
            placeholder="Nhập số tiền"
          />
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
        <div>
          <label className="block text-sm font-semibold text-gray-800">Ghi Chú</label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="mt-1 block w-full h-11 px-3 rounded-md border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-black"
            placeholder="Nhập ghi chú"
          />
        </div>
        <button
          onClick={isEditing ? onSave : onAdd}
          disabled={!formData.amount.trim() || !formData.note.trim() || parseFloat(formData.amount) <= 0}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isEditing ? <Save className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
          {isEditing ? 'Cập Nhật' : 'Thêm Giao Dịch'}
        </button>
      </div>
    </div>
  );
}