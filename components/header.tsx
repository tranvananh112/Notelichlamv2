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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/animations/gif tết.gif"
              alt="Tết"
              className="h-12 w-auto object-contain rounded-lg"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Note Công Việc</h1>
              <p className="text-white/80 text-sm">Theo dõi công việc và điểm danh</p>
            </div>
          </div>

          {/* Tet GIF 2 - Center */}
          <div className="flex justify-center">
            <img
              src="/animations/gif tết 2.gif"
              alt="Tết 2026"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-white/90">{formattedDate}</div>
            <div className="text-2xl font-bold font-mono">{formattedTime}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
