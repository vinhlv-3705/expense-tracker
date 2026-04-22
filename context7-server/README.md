# Expense Tracker MCP Server

MCP (Model Context Protocol) Server cho ứng dụng Expense Tracker, cho phép AI agents truy cập và thao tác với dữ liệu giao dịch tài chính.

## Cài đặt

```bash
npm install
```

## Chạy Server

```bash
npm start
```

## Tools có sẵn

### get_transactions
Lấy danh sách tất cả giao dịch.

**Parameters**: None

**Response**: Array of transaction objects

### add_transaction
Thêm giao dịch mới.

**Parameters**:
- `amount` (number): Số tiền
- `type` (string): "income" hoặc "expense"
- `category` (string): Danh mục
- `note` (string): Ghi chú

**Response**: Transaction object vừa tạo

### delete_transaction
Xóa giao dịch theo ID.

**Parameters**:
- `id` (string): ID của giao dịch

**Response**: Boolean (true nếu thành công)

### get_summary
Lấy tóm tắt tài chính.

**Parameters**: None

**Response**: Object với totalIncome, totalExpense, balance

## Resources có sẵn

- `expense-tracker://transactions`: Danh sách giao dịch JSON
- `expense-tracker://summary`: Tóm tắt tài chính JSON
- `expense-tracker://categories`: Chi tiêu theo danh mục JSON
- `expense-tracker://export/csv`: Dữ liệu CSV

## Kết nối với VS Code

Để kết nối MCP Server này với VS Code:

1. **Cài đặt VS Code Extension hỗ trợ MCP** (ví dụ: GitHub Copilot Chat với MCP support)

2. **Cấu hình MCP Server** trong settings.json của VS Code:
```json
{
  "mcp": {
    "servers": {
      "expense-tracker": {
        "command": "node",
        "args": ["path/to/context7-server/server.js"],
        "cwd": "path/to/expense-tracker/context7-server"
      }
    }
  }
}
```

3. **Khởi động lại VS Code** để áp dụng cấu hình

4. **Sử dụng trong Chat**: AI agents giờ có thể truy cập tools và resources của Expense Tracker

## Kiến trúc

- `transactionLogic.ts`: Logic xử lý giao dịch
- `tools.ts`: Định nghĩa các tools cho MCP
- `resources.ts`: Định nghĩa các resources cho MCP
- `server.js`: MCP server implementation
- `mcp-config.json`: Cấu hình context và folder map
