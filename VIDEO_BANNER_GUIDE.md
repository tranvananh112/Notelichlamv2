# 🎬 Hướng dẫn: Video Banner Logo

## ✅ Đã hoàn thành

### 1. **Tạo thư mục**
```
public/videos/  ← Đặt video vào đây
```

### 2. **Tạo Components**
- ✅ `video-banner.tsx` - Component hiển thị video
- ✅ Tích hợp vào `app-container.tsx`

## 📁 Cấu trúc thư mục

```
public/
  └── videos/
      └── logo-animation.mp4  ← ĐẶT VIDEO CỦA BẠN VÀO ĐÂY
```

## 🎯 Thông số video

### Video của bạn:
- **Kích thước**: 1920 x 1080 px (Full HD)
- **Thời lượng**: 12 giây
- **Format**: MP4 (khuyến nghị)

### Hiển thị trên web:
- **Chiều cao**: 180px (tự động scale)
- **Chiều rộng**: 100% (full width)
- **Mode**: object-contain (giữ tỷ lệ, không bị cắt)
- **Loop**: Lặp liên tục
- **Autoplay**: Tự động phát
- **Muted**: Tắt tiếng (để autoplay hoạt động)

## 📋 Cách sử dụng

### Bước 1: Đặt video vào thư mục
1. Đổi tên video thành: `logo-animation.mp4`
2. Copy vào: `public/videos/logo-animation.mp4`

### Bước 2: Tối ưu video (khuyến nghị)
Để web load nhanh hơn, nên compress video:

```bash
# Sử dụng FFmpeg để compress
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M logo-animation.mp4
```

Hoặc sử dụng online tools:
- https://www.freeconvert.com/video-compressor
- https://www.videosmaller.com/

**Target size**: < 5MB cho tốc độ tối ưu

### Bước 3: Test
1. Đặt video vào `public/videos/logo-animation.mp4`
2. Chạy: `npm run dev`
3. Mở browser và kiểm tra

## 🎨 Tùy chỉnh

### Thay đổi chiều cao:
```tsx
<VideoBanner 
  videoSrc="/videos/logo-animation.mp4"
  height={200}  // Thay đổi số này (px)
/>
```

### Thay đổi background khi loading:
Trong `video-banner.tsx`, dòng 21:
```tsx
className="... bg-gradient-to-r from-red-600 via-red-500 to-red-600"
// Đổi màu theo ý bạn
```

### Tắt loop (chỉ phát 1 lần):
Trong `video-banner.tsx`, dòng 32:
```tsx
loop={false}  // Thay vì loop
```

## 🔧 Tính năng

### ✅ Responsive
- Desktop: Full width, 180px height
- Mobile: Tự động scale, giữ tỷ lệ
- Tablet: Tương tự

### ✅ Performance
- Lazy loading
- Smooth fade-in khi video load xong
- Loading spinner khi đang tải
- Optimized playback

### ✅ Browser Support
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## 📊 Vị trí hiển thị

```
┌─────────────────────────────────────┐
│     VIDEO BANNER (180px height)     │  ← Video của bạn ở đây
│   Lặp liên tục, full width, giữa   │
├─────────────────────────────────────┤
│           Header (Clock)            │
├─────────────────────────────────────┤
│         Calendar & Content          │
└─────────────────────────────────────┘
```

## 🎬 Video Format Support

### Khuyến nghị:
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 hoặc 1280x720
- **Bitrate**: 2-4 Mbps
- **File size**: < 5MB

### Cũng hỗ trợ:
- WebM
- OGG
- MOV (sẽ convert sang MP4)

## 🚀 Optimization Tips

### 1. Compress video
- Giảm file size xuống < 5MB
- Giữ quality ở mức acceptable
- Sử dụng H.264 codec

### 2. Lazy load
- Video chỉ load khi cần
- Không ảnh hưởng initial page load

### 3. Preload
Nếu muốn video load trước:
```tsx
<video preload="auto" ...>
```

## 🐛 Troubleshooting

### Video không phát:
1. Kiểm tra file path: `public/videos/logo-animation.mp4`
2. Kiểm tra format: MP4 H.264
3. Kiểm tra browser console có lỗi không

### Video bị cắt/méo:
- Đổi `object-contain` thành `object-cover` nếu muốn fill
- Hoặc điều chỉnh `height` prop

### Video load chậm:
- Compress video nhỏ hơn
- Sử dụng CDN
- Enable caching

## 📱 Mobile Optimization

Video tự động:
- Scale theo màn hình
- Giữ tỷ lệ khung hình
- Autoplay (muted)
- Touch-friendly

## 🎯 Next Steps

Sau khi đặt video vào `public/videos/logo-animation.mp4`:

1. ✅ Video sẽ tự động hiển thị
2. ✅ Loop liên tục
3. ✅ Responsive trên mọi thiết bị
4. ✅ Loading smooth với animation

---

**Tạo bởi**: Kiro AI  
**Ngày**: 14/01/2026  
**Status**: ✅ Ready to use - Chỉ cần đặt video vào thư mục!