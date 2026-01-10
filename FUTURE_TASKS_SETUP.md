# Hướng dẫn nâng cấp tính năng Nhiệm vụ dự kiến

## Tổng quan
Tính năng "Nhiệm vụ dự kiến" đã được nâng cấp để lưu trữ dữ liệu vào Supabase database thay vì localStorage, đảm bảo dữ liệu không bị mất.

## Các cải tiến mới

### 1. Lưu trữ dữ liệu bền vững
- ✅ Dữ liệu được lưu vào Supabase database
- ✅ Backup tự động vào localStorage làm fallback
- ✅ Thông báo trạng thái lưu dữ liệu real-time

### 2. Tính năng Tags
- ✅ Thêm tags cho nhiệm vụ để phân loại
- ✅ Tìm kiếm theo tags
- ✅ Hiển thị tags với màu sắc đẹp mắt

### 3. Tìm kiếm và lọc nâng cao
- ✅ Tìm kiếm theo nội dung và tags
- ✅ Lọc theo trạng thái (Đang lên kế hoạch, Đang tiến hành, v.v.)
- ✅ Lọc theo mức độ ưu tiên (Cao, Trung bình, Thấp)
- ✅ Xóa bộ lọc nhanh chóng

### 4. Giao diện cải tiến
- ✅ Bullet Library để thêm ký hiệu nhanh
- ✅ Hiển thị số lượng kết quả tìm kiếm
- ✅ Thông báo trạng thái lưu dữ liệu
- ✅ Responsive design tốt hơn

## Cách setup

### Bước 1: Tạo bảng database
Chạy script SQL sau trong Supabase SQL Editor:

\`\`\`sql
-- Chạy file scripts/004_create_future_tasks_table.sql
\`\`\`

### Bước 2: Kiểm tra kết nối
1. Đảm bảo file `.env.local` có đầy đủ thông tin Supabase:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

2. Restart ứng dụng để áp dụng thay đổi

### Bước 3: Migration dữ liệu cũ (nếu có)
Nếu bạn đã có dữ liệu trong localStorage, hệ thống sẽ tự động:
- Hiển thị dữ liệu cũ từ localStorage
- Cho phép bạn thêm mới vào database
- Backup tự động để đảm bảo không mất dữ liệu

## Cách sử dụng

### Thêm nhiệm vụ mới
1. Chọn ngày trong lịch
2. Click tab "Nhiệm vụ dự kiến"
3. Click "Thêm nhiệm vụ dự kiến"
4. Nhập nội dung, chọn trạng thái, mức độ ưu tiên
5. Thêm tags (tùy chọn)
6. Click "Thêm"

### Tìm kiếm và lọc
1. Sử dụng ô tìm kiếm để tìm theo nội dung hoặc tags
2. Chọn bộ lọc trạng thái và mức độ ưu tiên
3. Click "Xóa bộ lọc" để reset

### Quản lý nhiệm vụ
- **Chỉnh sửa**: Click icon bút chì
- **Xóa**: Click icon thùng rác  
- **Thay đổi trạng thái nhanh**: Click vào các icon trạng thái khi hover

## Troubleshooting

### Lỗi kết nối Supabase
- Kiểm tra thông tin kết nối trong `.env.local`
- Đảm bảo RLS policies đã được tạo đúng
- Dữ liệu sẽ tự động fallback về localStorage

### Dữ liệu không đồng bộ
- Kiểm tra thông báo trạng thái ở góc trên bên trái
- Nếu hiển thị "Lỗi lưu dữ liệu", dữ liệu đã được backup local
- Thử refresh trang để kết nối lại

### Performance
- Hệ thống tự động backup vào localStorage
- Tìm kiếm và lọc hoạt động real-time
- Dữ liệu được cache để tăng tốc độ

## Lợi ích

1. **Không mất dữ liệu**: Lưu trữ bền vững trên cloud
2. **Đồng bộ đa thiết bị**: Truy cập từ bất kỳ đâu
3. **Tìm kiếm nhanh**: Tìm kiếm theo nội dung và tags
4. **Tổ chức tốt**: Phân loại theo trạng thái và mức độ ưu tiên
5. **Backup tự động**: Luôn có bản sao local để đảm bảo an toàn

## Kết luận

Tính năng "Nhiệm vụ dự kiến" giờ đây đã trở thành một công cụ quản lý công việc mạnh mẽ với khả năng lưu trữ bền vững, tìm kiếm nâng cao và giao diện thân thiện. Dữ liệu của bạn sẽ được bảo vệ và đồng bộ trên tất cả các thiết bị.