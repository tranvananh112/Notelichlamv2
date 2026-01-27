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
    <header className="sticky top-0 z-50 shadow-lg">
      {/* SVG Banner Only */}
      <div className="w-full">
        <img
          src="/Thanh Ngang Năm Mới.svg"
          alt="Năm Mới"
          className="w-full h-auto object-contain"
        />
      </div>
    </header>
  )
}
