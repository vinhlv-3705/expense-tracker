// Transaction Logic Module for MCP Server

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  date: string;
}

const categories = ["Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Khác"];

class TransactionManager {
  private transactions: Transaction[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("expense-tracker-transactions");
      if (saved) {
        try {
          this.transactions = JSON.parse(saved);
        } catch (error) {
          this.setDefaultData();
        }
      } else {
        this.setDefaultData();
      }
    }
  }

  private setDefaultData() {
    this.transactions = [
      { id: "1", amount: 5000000, type: "income", category: "Khác", note: "Lương tháng 4", date: "2024-04-01" },
      { id: "2", amount: 200000, type: "expense", category: "Ăn uống", note: "Ăn trưa", date: "2024-04-02" },
      { id: "3", amount: 150000, type: "expense", category: "Di chuyển", note: "Xăng xe", date: "2024-04-03" },
      { id: "4", amount: 1000000, type: "income", category: "Khác", note: "Thưởng", date: "2024-04-05" },
      { id: "5", amount: 300000, type: "expense", category: "Mua sắm", note: "Quần áo", date: "2024-04-07" },
    ];
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("expense-tracker-transactions", JSON.stringify(this.transactions));
    }
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  addTransaction(amount: number, type: "income" | "expense", category: string, note: string): Transaction {
    if (!note.trim() || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid transaction data");
    }
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount,
      type,
      category,
      note: note.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    this.transactions.unshift(newTransaction);
    this.saveToStorage();
    return newTransaction;
  }

  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.transactions.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  updateTransaction(id: string, updates: Partial<Omit<Transaction, "id">>): Transaction | null {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) return null;
    Object.assign(transaction, updates);
    this.saveToStorage();
    return transaction;
  }

  getSummary() {
    const totalIncome = this.transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = this.transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
  }

  getExpenseByCategory() {
    return this.transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        const existing = acc.find(item => item.category === t.category);
        if (existing) {
          existing.amount += t.amount;
        } else {
          acc.push({ category: t.category, amount: t.amount });
        }
        return acc;
      }, [] as { category: string; amount: number }[])
      .sort((a, b) => b.amount - a.amount);
  }

  exportToCSV(): string {
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const csvContent = [
      headers.join(","),
      ...this.transactions.map(t => [
        t.date,
        t.type === "income" ? "Thu nhập" : "Chi tiêu",
        t.category,
        t.amount.toString(),
        `\"${t.note}\"`
      ].join(","))
    ].join("\n");
    return csvContent;
  }
}

export { TransactionManager, categories };
export type { Transaction };
