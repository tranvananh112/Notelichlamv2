"use client"
import { BarChart3 } from "lucide-react"

interface ReportsButtonProps {
  onClick: () => void
}

export default function ReportsButton({ onClick }: ReportsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
      title="Xem thống kê"
    >
      <BarChart3 className="w-6 h-6" />
    </button>
  )
}
