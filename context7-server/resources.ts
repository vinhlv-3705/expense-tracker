// MCP Resources for Expense Tracker

import { TransactionManager } from "./transactionLogic";

const manager = new TransactionManager();

export const resources = {
  transactions: {
    uri: "expense-tracker://transactions",
    name: "All Transactions",
    description: "Complete list of all expense and income transactions",
    mimeType: "application/json",
    content: () => JSON.stringify(manager.getTransactions(), null, 2)
  },

  summary: {
    uri: "expense-tracker://summary",
    name: "Financial Summary",
    description: "Total income, expenses, and balance",
    mimeType: "application/json",
    content: () => JSON.stringify(manager.getSummary(), null, 2)
  },

  categories: {
    uri: "expense-tracker://categories",
    name: "Expense Categories",
    description: "Breakdown of expenses by category",
    mimeType: "application/json",
    content: () => JSON.stringify(manager.getExpenseByCategory(), null, 2)
  },

  csv_export: {
    uri: "expense-tracker://export/csv",
    name: "CSV Export",
    description: "Transactions exported in CSV format",
    mimeType: "text/csv",
    content: () => manager.exportToCSV()
  }
};
