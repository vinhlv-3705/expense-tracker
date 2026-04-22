import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import AddTransactionForm from './AddTransactionForm';

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  date: string;
}

interface EditTransactionModalProps {
  transaction: Transaction | null;
  categories: string[];
  onSave: (updatedTransaction: Transaction) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function EditTransactionModal({ transaction, categories, onSave, onClose, isOpen }: EditTransactionModalProps) {
  const formData = useMemo(() => {
    if (transaction && isOpen) {
      return {
        amount: transaction.amount.toString(),
        type: transaction.type,
        category: transaction.category,
        note: transaction.note,
      };
    }
    return {
      amount: '',
      type: 'expense' as 'income' | 'expense',
      category: categories[0] || '',
      note: '',
    };
  }, [transaction, isOpen, categories]);

  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleSave = () => {
    const amount = parseFloat(localFormData.amount);
    if (!localFormData.amount.trim() || !localFormData.note.trim() || isNaN(amount) || amount <= 0) return;

    if (transaction) {
      const updatedTransaction: Transaction = {
        ...transaction,
        amount: amount,
        type: localFormData.type,
        category: localFormData.category,
        note: localFormData.note.trim(),
      };
      onSave(updatedTransaction);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sửa Giao Dịch</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <AddTransactionForm
          formData={localFormData}
          setFormData={setLocalFormData}
          onAdd={handleSave}
          categories={categories}
          isEditing={true}
          onSave={handleSave}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}