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
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
              📅
            </div>
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

          <div className="text-right">
            <div className="text-sm font-semibold text-white/90">{formattedDate}</div>
            <div className="text-2xl font-bold font-mono">{formattedTime}</div>
          </div>
        </div>

        {/* Large Horse Icons - Positioned Absolutely */}
        <img
          src="/ngựa.svg"
          alt="Ngựa Tết"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-32 w-auto object-contain opacity-30 pointer-events-none"
        />
        <img
          src="/ngựa.svg"
          alt="Ngựa Tết"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-32 w-auto object-contain opacity-30 pointer-events-none"
        />

        {/* Tet GIF 2 - Center */}
        <img
          src="/animations/gif tết 2.gif"
          alt="Tết 2026"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-auto object-contain pointer-events-none z-10"
        />
      </div>
    </header>
  )
}
