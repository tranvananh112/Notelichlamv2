# 🎯 Active States - Hướng dẫn sử dụng

## ✨ Tính năng mới: Toolbar giống Microsoft Word

### 🔥 Active States cho các nút:
- **Bold/Italic/Underline**: Sáng màu xanh khi active
- **Alignment**: Sáng màu xanh lá khi active  
- **Lists**: Sáng màu tím khi active
- **Real-time detection**: Cập nhật tức thì khi di chuyển cursor

## 🎨 Visual Feedback

### 🔵 Format Buttons (Bold, Italic, Underline):
- **Inactive**: Nền trắng, hover xanh nhạt
- **Active**: Nền xanh đậm, chữ trắng, có shadow
- **Transition**: Smooth animation khi chuyển đổi

### 🟢 Alignment Buttons (Left, Center, Right):
- **Inactive**: Nền trắng, hover xanh lá nhạt
- **Active**: Nền xanh lá đậm, chữ trắng, có shadow
- **Smart detection**: Tự động detect căn chỉnh hiện tại

### 🟣 List Buttons (Bullet, Numbered):
- **Inactive**: Nền trắng, hover tím nhạt
- **Active**: Nền tím đậm, chữ trắng, có shadow
- **List detection**: Biết khi cursor trong list

## 🚀 Cách hoạt động

### 1. Click để toggle:
```
Click Bold → Nút sáng xanh → Text in đậm
Click Bold lại → Nút tắt → Text bình thường
```

### 2. Auto-detection:
```
Di chuyển cursor vào text đậm → Nút Bold tự sáng
Di chuyển ra text thường → Nút Bold tự tắt
```

### 3. Multiple states:
```
Có thể có Bold + Italic cùng lúc
Alignment chỉ 1 trong 3 (Left/Center/Right)
Lists có thể Bullet hoặc Numbered
```

## ⚡ Technical Implementation

### 🔧 queryCommandState():
- Sử dụng `document.queryCommandState()` 
- Check trạng thái format tại cursor
- Real-time detection

### 📡 Event Listeners:
- `selectionchange`: Khi di chuyển cursor
- `input`: Khi gõ văn bản
- `click`: Khi click buttons

### 🎭 CSS Classes:
```css
/* Inactive */
hover:bg-blue-100 dark:hover:bg-blue-900

/* Active */
bg-blue-500 text-white hover:bg-blue-600 shadow-md
```

## 🎯 User Experience

### ✅ Giống Microsoft Word:
- Nút sáng khi format active
- Tắt khi click lại
- Auto-detect khi di chuyển cursor
- Smooth transitions

### 🎨 Color Coding:
- **Xanh**: Format (Bold, Italic, Underline)
- **Xanh lá**: Alignment (Left, Center, Right)
- **Tím**: Lists (Bullet, Numbered)
- **Vàng**: Colors
- **Indigo**: Bullets Library

### 📱 Responsive:
- Hoạt động trên desktop
- Touch-friendly trên mobile
- Consistent across devices

## 🧪 Test Cases

### 1. Basic Toggle:
```
1. Click Bold → Nút sáng xanh
2. Gõ text → Text in đậm
3. Click Bold lại → Nút tắt
4. Gõ text → Text bình thường
✅ Pass
```

### 2. Cursor Movement:
```
1. Gõ: "Hello **World**" (World in đậm)
2. Click vào "Hello" → Bold button tắt
3. Click vào "World" → Bold button sáng
✅ Pass
```

### 3. Multiple Formats:
```
1. Click Bold → Sáng xanh
2. Click Italic → Sáng xanh (cùng lúc)
3. Gõ text → Bold + Italic
✅ Pass
```

## 🔧 Troubleshooting

### Nếu buttons không sáng:
1. Refresh trang (F5)
2. Check browser support
3. Try different text selection

### Nếu detection không chính xác:
1. Click vào text rồi check
2. Ensure cursor trong text
3. Try keyboard shortcuts

---

**Status**: ✅ Production Ready  
**UX**: 🎯 Microsoft Word-like  
**Performance**: ⚡ Optimized