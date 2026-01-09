# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị Supabase

1. Truy cập [Supabase](https://supabase.com) và tạo account
2. Tạo project mới
3. Vào Settings > API để lấy:
   - Project URL
   - Anon public key

## Bước 2: Deploy lên Vercel

### Cách 1: Kết nối GitHub (Khuyến nghị)

1. Push code lên GitHub repository
2. Truy cập [Vercel](https://vercel.com)
3. Import project từ GitHub
4. Chọn repository `Notelichlamv2`
5. Thêm Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
6. Click Deploy

### Cách 2: Vercel CLI

1. Cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login và deploy:
   ```bash
   vercel login
   vercel --prod
   ```

3. Thêm environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## Bước 3: Cấu hình Domain (Tùy chọn)

1. Vào Vercel dashboard
2. Chọn project
3. Vào Settings > Domains
4. Thêm custom domain

## Kiểm tra Deploy

Sau khi deploy thành công:

1. Truy cập URL được cung cấp bởi Vercel
2. Kiểm tra trang chủ load được
3. Thử đăng ký/đăng nhập
4. Kiểm tra các tính năng chính

## Troubleshooting

### Lỗi Build
- Kiểm tra TypeScript errors: `pnpm build`
- Xem logs trong Vercel dashboard

### Lỗi Supabase
- Kiểm tra environment variables
- Verify Supabase URL và keys
- Kiểm tra network trong browser console

### Performance
- Vercel tự động optimize
- Images được optimize với Next.js Image component
- Static files được cache tự động