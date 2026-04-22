# Tài liệu Đặc tả Expense Tracker

## 1. Tổng quan
Ứng dụng Expense Tracker là một công cụ quản lý tài chính cá nhân giúp người dùng theo dõi thu nhập và chi tiêu hàng ngày. Ứng dụng cung cấp giao diện trực quan để thêm, sửa, xóa giao dịch và xem báo cáo tài chính.

## 2. Kiến trúc hệ thống
### 2.1 Công nghệ sử dụng
- **Frontend Framework**: Next.js 14 với App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Local Storage (trình duyệt)

### 2.2 Cấu trúc thư mục
```
expense-tracker/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── AddTransactionForm.tsx
│   ├── EditTransactionModal.tsx
│   ├── ExpenseChart.tsx
│   ├── SummaryCards.tsx
│   └── TransactionList.tsx
├── context7-server/       # MCP Server implementation
├── specs/                 # Documentation & Knowledge Base
└── public/               # Static assets
```

## 3. Logic nghiệp vụ
### 3.1 Quản lý giao dịch (Transaction Management)
- **Thực thể Transaction**:
  - id: string (unique identifier)
  - amount: number (số tiền)
  - type: "income" | "expense" (loại giao dịch)
  - category: string (danh mục)
  - note: string (ghi chú)
  - date: string (ngày tháng)

- **Danh mục mặc định**: Ăn uống, Di chuyển, Mua sắm, Giải trí, Khác

### 3.2 Tính toán tài chính
- **Tổng thu nhập**: Tổng các giao dịch có type = "income"
- **Tổng chi tiêu**: Tổng các giao dịch có type = "expense"
- **Số dư**: Tổng thu nhập - Tổng chi tiêu
- **Chi tiêu theo danh mục**: Gom nhóm chi tiêu theo category

### 3.3 Lưu trữ dữ liệu
- Sử dụng localStorage của trình duyệt
- Key: "expense-tracker-transactions"
- Format: JSON array of Transaction objects
- Tự động load/save khi có thay đổi

## 4. Chức năng chính
### 4.1 Dashboard
- Hiển thị các thẻ tóm tắt: Tổng dư, Tổng thu, Tổng chi
- Biểu đồ tròn phân loại chi tiêu theo danh mục
- Danh sách giao dịch gần đây

### 4.2 Quản lý giao dịch
- **Thêm giao dịch**: Form nhập liệu với validation
- **Sửa giao dịch**: Modal edit với dữ liệu pre-filled
- **Xóa giao dịch**: Confirm dialog trước khi xóa
- **Lọc giao dịch**: Theo tháng (all/current/previous), danh mục, từ khóa tìm kiếm

### 4.3 Xuất dữ liệu
- Export danh sách giao dịch ra file CSV
- Format: Date, Type, Category, Amount, Note

## 5. MCP Integration (Model Context Protocol)
### 5.1 Tools (Hàm có thể gọi)
- `get_transactions`: Lấy danh sách tất cả giao dịch
- `add_transaction`: Thêm giao dịch mới
- `delete_transaction`: Xóa giao dịch theo ID
- `get_summary`: Lấy tóm tắt tài chính

### 5.2 Resources (Dữ liệu có thể truy cập)
- `expense-tracker://transactions`: Danh sách giao dịch JSON
- `expense-tracker://summary`: Tóm tắt tài chính JSON
- `expense-tracker://categories`: Chi tiêu theo danh mục JSON
- `expense-tracker://export/csv`: Dữ liệu CSV

### 5.3 Context Information
- Folder Map: Mô tả cấu trúc thư mục và mục đích
- Business Logic: Giải thích logic cốt lõi của ứng dụng
- Key Features: Danh sách tính năng chính

## 6. Quy trình phát triển
### 6.1 Thiết lập môi trường
```bash
npm install
npm run dev
```

### 6.2 Kết nối MCP Server
1. Cài đặt MCP SDK
2. Chạy server.js trong context7-server/
3. Cấu hình VS Code extension để kết nối MCP server

### 6.3 Triển khai
- Build production: `npm run build`
- Start production: `npm start`

## 7. Yêu cầu phi chức năng
- Responsive design (mobile-friendly)
- Performance: Load nhanh, smooth animations
- Accessibility: Keyboard navigation, screen reader support
- Security: Client-side only, no sensitive data exposure
