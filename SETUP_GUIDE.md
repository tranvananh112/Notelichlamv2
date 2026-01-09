# Hướng Dẫn Cài Đặt Hệ Thống Ghi Chú Công Việc

## Bước 1: Thiết Lập Supabase

1. Đảm bảo Supabase đã được kết nối trong dự án v0
2. Copy environment variables từ Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Bước 2: Chạy SQL Script để Tạo Database

1. Vào Supabase Dashboard → SQL Editor
2. Tạo query mới và copy toàn bộ nội dung từ `scripts/001_create_tables.sql`
3. Click "Run" để chạy script
4. Script sẽ tạo:
   - `users` table (lưu thông tin người dùng)
   - `notes` table (ghi chú công việc)
   - `payroll_history` table (lịch sử thanh toán)
   - `work_tracking` table (theo dõi ngày làm việc)
   - RLS policies (bảo vệ dữ liệu)
   - Trigger tự động tạo user profile

## Bước 3: Tạo Tài Khoản Admin

### Tạo Admin Thủ Công (Nếu Cần)

Chạy SQL này trong Supabase SQL Editor:

```sql
-- Tạo admin user (sau khi admin đã đăng ký)
UPDATE public.users 
SET is_admin = TRUE 
WHERE email = 'admin@example.com';
```

### Hoặc Tạo Qua UI

1. Truy cập `/auth/sign-up` và đăng ký với email admin
2. Sau khi đăng ký thành công, chạy SQL ở trên để cấp quyền admin

## Bước 4: Quản Lý Tài Khoản

Khi đã đăng nhập bằng tài khoản admin:

1. Click nút "Quản Lí Tài Khoản" ở góc trên phải
2. Nhập email và mật khẩu người dùng mới
3. Click "Tạo Tài Khoản" để thêm người dùng vào hệ thống

## Tính Năng Chính

### Ghi Chú Công Việc
- Chọn ngày trong lịch
- Click vào ghi chú hoặc nút "+ Thêm Ghi Chú"
- Nhập nội dung, chọn màu, thiết lập tiến độ
- Có nút hoàn thành (tròn xanh) để đánh dấu công việc xong

### Điểm Danh Ngày Làm Việc
- Chọn ngày → Click "+ Thêm Ghi Chú"
- Chọn loại "Điểm Danh"
- Hệ thống tự động theo dõi

### Tính Lương Tự Động
- Khi đủ 30 ngày làm việc:
  - Modal hiện lên yêu cầu xác nhận nhận lương
  - Nhập số tiền lương
  - Click "Xác Nhận" để lưu
- Lịch sử thanh toán được lưu trong báo cáo

### Báo Cáo & Thống Kê
- Click icon biểu đồ bên phải
- Xem:
  - Số ngày làm việc / 30
  - Số ghi chú
  - Số điểm danh
  - Tổng lương đã nhận
  - Lịch sử thanh toán chi tiết

## Các Tài Khoản Demo

### Tài Khoản Admin (Tạo Admin Đầu Tiên)
- Email: `admin@example.com` (hoặc email bất kỳ)
- Mật khẩu: Tùy chọn
- Sau khi tạo, chạy SQL để cấp quyền admin

### Người Dùng Thường
- Admin tạo thông qua "Quản Lí Tài Khoản"
- Họ sẽ nhân được email/mật khẩu từ admin
- Đăng nhập và bắt đầu ghi chú

## Lưu Ý Quan Trọng

1. **Dữ liệu được lưu trên Supabase**: Mỗi người dùng chỉ thấy dữ liệu của mình
2. **Row Level Security (RLS)**: Bảo vệ dữ liệu người dùng khỏi bị truy cập trái phép
3. **Session Token**: Tự động làm mới, không cần đăng nhập lại trên cùng thiết bị
4. **Admin Dashboard**: Chỉ admin mới có thể tạo/xóa tài khoản

## Troubleshooting

### Lỗi "Tài khoản không được tạo"
- Kiểm tra email đã tồn tại chưa
- Kiểm tra mật khẩu có đủ mạnh không (tối thiểu 6 ký tự)

### Lỗi "Không thể tải dữ liệu"
- Kiểm tra Supabase connection
- Kiểm tra environment variables đã set đúng chưa
- Kiểm tra RLS policies đã được tạo chưa

### Lỗi "Redirect không đúng"
- Đảm bảo middleware.ts đã được tạo
- Làm mới trình duyệt (Ctrl+F5)
- Clear cookies của ứng dụng

## Thế Nào Để Đặt Lại Dữ Liệu

Nếu cần xóa tất cả dữ liệu và bắt đầu lại:

```sql
-- Xóa tất cả dữ liệu (cẩn thận!)
TRUNCATE TABLE public.payroll_history CASCADE;
TRUNCATE TABLE public.notes CASCADE;
TRUNCATE TABLE public.work_tracking CASCADE;
TRUNCATE TABLE public.users CASCADE;
```

---

**Cần giúp?** Kiểm tra Supabase dashboard hoặc logs của Next.js application.
