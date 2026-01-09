"use client"
import { X, Calendar, FileText, CheckCircle, TrendingUp } from "lucide-react"

interface ReportsModalProps {
  daysWorked: number
  workStartDate: Date | null
  payrollHistory: Array<{ date: string; amount: number }>
  notes: Record<
    string,
    Array<{
      id: string
      text: string
      timestamp: string
      type: "note" | "attendance"
      color?: string
      progress?: number
    }>
  >
  isOpen: boolean
  onClose: () => void
}

export default function ReportsModal({
  daysWorked,
  workStartDate,
  payrollHistory,
  notes,
  isOpen,
  onClose,
}: ReportsModalProps) {
  if (!isOpen) return null

  const totalNotes = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + dayNotes.filter((n) => n.type === "note").length
  }, 0)

  const totalAttendance = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + (dayNotes.some((n) => n.type === "attendance") ? 1 : 0)
  }, 0)

  const completedNotes = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + dayNotes.filter((n) => n.type === "note" && n.completed).length
  }, 0)

  const avgProgress = totalNotes > 0
    ? Math.round(Object.values(notes).reduce((sum, dayNotes) => {
      return sum + dayNotes.filter((n) => n.type === "note").reduce((s, n) => s + (n.progress || 0), 0)
    }, 0) / totalNotes)
    : 0

  // Thống kê ca làm việc
  const workShiftStats = Object.values(notes).reduce((acc, dayNotes) => {
    const attendance = dayNotes.find((n) => n.type === "attendance")
    if (attendance) {
      if (attendance.text.includes("Cả ngày")) acc.fullDay++
      else if (attendance.text.includes("Buổi sáng")) acc.morning++
      else if (attendance.text.includes("Buổi chiều")) acc.afternoon++
    }
    return acc
  }, { fullDay: 0, morning: 0, afternoon: 0 })

  // Thống kê theo màu
  const colorStats = Object.values(notes).reduce((acc, dayNotes) => {
    dayNotes.filter((n) => n.type === "note").forEach((note) => {
      const color = note.color || "blue"
      acc[color] = (acc[color] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const totalEarned = payrollHistory.reduce((sum, payment) => sum + payment.amount, 0)
  const progressPercentage = Math.min((daysWorked / 30) * 100, 100)

  const stats = [
    {
      icon: Calendar,
      label: "Ngày làm việc",
      value: daysWorked,
      suffix: "/30",
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: FileText,
      label: "Tổng ghi chú",
      value: totalNotes,
      suffix: "",
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: CheckCircle,
      label: "Hoàn thành",
      value: completedNotes,
      suffix: `/${totalNotes}`,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: TrendingUp,
      label: "Tiến độ TB",
      value: avgProgress,
      suffix: "%",
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Thống Kê Công Việc</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border border-slate-200 dark:border-slate-700 ${stat.bgLight} transition-all hover:shadow-lg`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-3 shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {typeof stat.value === "number" ? stat.value.toLocaleString("vi-VN") : stat.value}
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{stat.suffix}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Work Shift Statistics */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Thống kê ca làm việc
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="text-3xl mb-2">🌞</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Cả ngày</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{workShiftStats.fullDay}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-3xl mb-2">🌅</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Buổi sáng</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{workShiftStats.morning}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="text-3xl mb-2">🌆</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Buổi chiều</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{workShiftStats.afternoon}</p>
                </div>
              </div>
            </div>

            {/* Color Statistics */}
            {Object.keys(colorStats).length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  Phân loại ghi chú theo màu
                </h4>
                <div className="space-y-2">
                  {Object.entries(colorStats).map(([color, count]) => {
                    const colorMap: Record<string, { name: string; bg: string; text: string }> = {
                      blue: { name: "Xanh dương", bg: "bg-blue-500", text: "text-blue-600" },
                      red: { name: "Đỏ", bg: "bg-red-500", text: "text-red-600" },
                      green: { name: "Xanh lá", bg: "bg-green-500", text: "text-green-600" },
                      yellow: { name: "Vàng", bg: "bg-yellow-500", text: "text-yellow-600" },
                      purple: { name: "Tím", bg: "bg-purple-500", text: "text-purple-600" },
                      pink: { name: "Hồng", bg: "bg-pink-500", text: "text-pink-600" },
                    }
                    const colorInfo = colorMap[color] || { name: color, bg: "bg-gray-500", text: "text-gray-600" }
                    const percentage = Math.round((count / totalNotes) * 100)

                    return (
                      <div key={color} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${colorInfo.bg} flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-700 dark:text-slate-300">{colorInfo.name}</span>
                            <span className={`text-sm font-bold ${colorInfo.text}`}>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorInfo.bg} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Progress Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Tiến độ nhận lương</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{daysWorked}/30 ngày</span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-2">
                {daysWorked === 30 ? "✨ Sẵn sàng nhận lương!" : `Còn ${30 - daysWorked} ngày nữa để nhận lương`}
              </p>
            </div>

            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">💰 Tổng thu nhập</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {totalEarned.toLocaleString("vi-VN")}đ
                  </p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                    {payrollHistory.length} lần thanh toán
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
                  💵
                </div>
              </div>
            </div>

            {/* Payment History Section */}
            {payrollHistory.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Lịch sử thanh toán</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {payrollHistory.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50"
                    >
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {new Date(payment.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        +{payment.amount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
