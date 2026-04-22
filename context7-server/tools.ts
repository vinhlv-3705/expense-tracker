// MCP Tools for Expense Tracker

import { TransactionManager } from "./transactionLogic";

const manager = new TransactionManager();

export const tools = {
  get_transactions: {
    name: "get_transactions",
    description: "Retrieve all transactions",
    parameters: { type: "object", properties: {}, required: [] },
    handler: () => manager.getTransactions()
  },

  add_transaction: {
    name: "add_transaction",
    description: "Add a new transaction",
    parameters: {
      type: "object",
      properties: {
        amount: { type: "number" },
        type: { type: "string", enum: ["income", "expense"] },
        category: { type: "string" },
        note: { type: "string" }
      },
      required: ["amount", "type", "category", "note"]
    },
    handler: (params: any) => manager.addTransaction(params.amount, params.type, params.category, params.note)
  },

  delete_transaction: {
    name: "delete_transaction",
    description: "Delete a transaction by ID",
    parameters: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"]
    },
    handler: (params: any) => manager.deleteTransaction(params.id)
  },

  get_summary: {
    name: "get_summary",
    description: "Get financial summary",
    parameters: { type: "object", properties: {}, required: [] },
    handler: () => manager.getSummary()
  }
};
