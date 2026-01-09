# Ghi Chú Công Việc - Work Notes App

Ứng dụng quản lý công việc và tính lương thông minh được xây dựng với Next.js và Supabase.

## Tính năng chính

- 📅 **Quản lý lịch làm việc**: Ghi lại ngày làm việc và xem lịch sử
- 📝 **Ghi chú có màu**: Tạo ghi chú với 6 màu khác nhau và theo dõi tiến độ (0-100%)
- 💰 **Tính lương tự động**: Thông báo khi đủ 30 ngày làm việc
- 👤 **Đăng nhập đa thiết bị**: Dữ liệu đồng bộ trên mọi thiết bị
- 📊 **Báo cáo thống kê**: Xem báo cáo chi tiết về công việc và lương

## Công nghệ sử dụng

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Vercel

## Cài đặt và chạy local

1. Clone repository:
```bash
git clone https://github.com/tranvananh112/Notelichlamv2.git
cd Notelichlamv2
```

2. Cài đặt dependencies:
```bash
pnpm install
```

3. Tạo file `.env.local` từ `.env.example`:
```bash
cp .env.example .env.local
```

4. Cấu hình Supabase trong `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Chạy development server:
```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Deploy lên Vercel

### Tự động (Khuyến nghị)

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Thêm environment variables trong Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy tự động

### Thủ công

```bash
pnpm build
```

## Cấu hình Supabase

Để ứng dụng hoạt động, bạn cần:

1. Tạo project trên [Supabase](https://supabase.com)
2. Lấy URL và Anon Key từ Settings > API
3. Cấu hình trong file `.env.local` hoặc Vercel environment variables

## Scripts

- `pnpm dev` - Chạy development server
- `pnpm build` - Build production
- `pnpm start` - Chạy production server
- `pnpm lint` - Kiểm tra linting

## Cấu trúc project

```
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                 # Utilities và Supabase config
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── styles/              # CSS styles
```
