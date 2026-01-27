"use client"

interface HeaderProps {
  currentTime: Date
}

export default function Header({ currentTime }: HeaderProps) {
  const weekDays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  const dayOfWeek = weekDays[currentTime.getDay()]
  const day = currentTime.getDate()
  const month = months[currentTime.getMonth()]
  const year = currentTime.getFullYear()
  const formattedDate = `${dayOfWeek}, ${day} ${month} năm ${year}`

  const formattedTime = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-white">
      {/* Banner Anh 2026 */}
      <div className="w-full overflow-hidden">
        <img
          src="/banner anh2026.svg"
          alt="Banner 2026"
          className="w-full h-auto object-cover max-h-[120px]"
        />
      </div>

      {/* Time Display Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-end gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-700">{formattedDate}</div>
            <div className="text-lg font-bold font-mono text-purple-600">{formattedTime}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
