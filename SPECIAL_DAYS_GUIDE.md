# Hướng Dẫn Thêm Chức Năng Đánh Dấu Ngày Đặc Biệt

## Đã Hoàn Thành
1. ✅ Thêm SVG ngựa vào header (2 con ngựa hai bên GIF Tết 2)
2. ✅ Tạo component SpecialDayModal để đánh dấu ngày
3. ✅ Tạo SQL script để tạo bảng special_days

## Cần Thực Hiện

### 1. Chạy SQL Script
Chạy file `scripts/007_create_special_days_table.sql` trong Supabase SQL Editor để tạo bảng.

### 2. Cập Nhật app-container.tsx

Thêm state cho special days (sau dòng ~80):
```typescript
const [specialDays, setSpecialDays] = useState<Record<string, string>>({}) // dateKey -> type
const [showSpecialDayModal, setShowSpecialDayModal] = useState(false)
const [specialDayModalDate, setSpecialDayModalDate] = useState<Date | null>(null)
```

Thêm import SpecialDayModal (sau dòng ~20):
```typescript
const SpecialDayModal = dynamic(() => import("./special-day-modal"))
```

Thêm useEffect để load special days (sau dòng ~120):
```typescript
// Load special days
useEffect(() => {
  const loadSpecialDays = async () => {
    try {
      const { data, error } = await supabase
        .from("special_days")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("Error loading special days:", error)
      } else {
        const daysMap = data?.reduce((acc: Record<string, string>, day: any) => {
          acc[day.date] = day.type
          return acc
        }, {}) || {}
        setSpecialDays(daysMap)
      }
    } catch (error) {
      console.error("Error loading special days:", error)
    }
  }

  loadSpecialDays()
}, [user.id])
```

Thêm functions để quản lý special days (sau dòng ~400):
```typescript
const getSpecialDayType = (date: Date): string | null => {
  const key = date.toISOString().split("T")[0]
  return specialDays[key] || null
}

const handleSpecialDayClick = (date: Date) => {
  setSpecialDayModalDate(date)
  setShowSpecialDayModal(true)
}

const saveSpecialDay = async (type: string | null) => {
  if (!specialDayModalDate) return

  const dateKey = specialDayModalDate.toISOString().split("T")[0]

  try {
    if (type === null) {
      // Remove special day
      await supabase
        .from("special_days")
        .delete()
        .eq("user_id", user.id)
        .eq("date", dateKey)

      setSpecialDays(prev => {
        const updated = { ...prev }
        delete updated[dateKey]
        return updated
      })
    } else {
      // Add or update special day
      await supabase
        .from("special_days")
        .upsert({
          user_id: user.id,
          date: dateKey,
          type: type
        })

      setSpecialDays(prev => ({
        ...prev,
        [dateKey]: type
      }))
    }
  } catch (error) {
    console.error("Error saving special day:", error)
  }
}
```

Thêm modal vào JSX (trước tag </main> cuối cùng):
```typescript
{showSpecialDayModal && specialDayModalDate && (
  <SpecialDayModal
    date={specialDayModalDate}
    currentType={getSpecialDayType(specialDayModalDate)}
    onSave={saveSpecialDay}
    onClose={() => setShowSpecialDayModal(false)}
  />
)}
```

### 3. Cập Nhật calendar-view.tsx

Thêm props mới vào interface CalendarViewProps:
```typescript
getSpecialDayType: (date: Date) => string | null
onSpecialDayClick: (date: Date) => void
```

Trong phần render ngày, thêm hiển thị icon đặc biệt:
```typescript
const specialType = getSpecialDayType(date)

// Thêm vào JSX của mỗi ngày:
{specialType && (
  <div className="absolute top-1 right-1">
    {specialType === 'horse' && (
      <img src="/ngựa.svg" alt="Ngày đặc biệt" className="w-6 h-6" />
    )}
    {specialType === 'tet' && <span className="text-lg">🎊</span>}
    {specialType === 'holiday' && <span className="text-lg">🎉</span>}
  </div>
)}

// Thêm button để đánh dấu (right-click hoặc long press):
<button
  onClick={(e) => {
    e.stopPropagation()
    onSpecialDayClick(date)
  }}
  className="absolute bottom-1 right-1 opacity-0 hover:opacity-100 transition-opacity"
>
  ⭐
</button>
```

### 4. Cập Nhật app-container.tsx - Truyền props cho CalendarView

```typescript
<CalendarView
  selectedDate={selectedDate}
  onDateSelect={handleDateSelect}
  getNoteCount={getNoteCount}
  getHasAttendance={getHasAttendance}
  getAttendanceInfo={getAttendanceInfo}
  getFutureTasksCount={getFutureTasksCount}
  getIncompleteNoteCount={getIncompleteNoteCount}
  getSpecialDayType={getSpecialDayType}
  onSpecialDayClick={handleSpecialDayClick}
/>
```

## Cách Sử Dụng

1. Click vào biểu tượng ⭐ ở góc dưới bên phải của ngày trong lịch
2. Chọn loại ngày đặc biệt:
   - 🎊 Ngày Tết
   - 🎉 Nghỉ Lễ  
   - 🐴 Ngày Đặc Biệt (hiển thị icon ngựa SVG)
   - ❌ Bỏ đánh dấu
3. Click "Lưu" để lưu lại

## Icon Hiển Thị
- Ngày Tết: 🎊 (góc trên bên phải)
- Nghỉ Lễ: 🎉 (góc trên bên phải)
- Ngày Đặc Biệt: 🐴 SVG ngựa (góc trên bên phải)
