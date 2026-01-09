"use client"
import { Calendar, FileText, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"

interface ReportsDrawerProps {
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
  showReportsDrawer: boolean
  setShowReportsDrawer: (show: boolean) => void
}

export default function ReportsDrawer({
  daysWorked,
  workStartDate,
  payrollHistory,
  notes,
  showReportsDrawer,
  setShowReportsDrawer,
}: ReportsDrawerProps) {
  const totalNotes = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + dayNotes.filter((n) => n.type === "note").length
  }, 0)

  const totalAttendance = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + (dayNotes.some((n) => n.type === "attendance") ? 1 : 0)
  }, 0)

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
      label: "Ghi chú",
      value: totalNotes,
      suffix: "",
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: CheckCircle,
      label: "Điểm danh",
      value: totalAttendance,
      suffix: "",
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: TrendingUp,
      label: "Tổng lương",
      value: totalEarned,
      suffix: "đ",
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => setShowReportsDrawer(true)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center absolute top-4 right-4"
        title="Xem thống kê"
      >
        <BarChart3 className="w-6 h-6" />
      </button>

      {showReportsDrawer && (
        <>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Thống Kê</h3>

          {/* Stats Grid - 4 cards displayed at full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-5 border border-slate-200 dark:border-slate-700 ${stat.bgLight} transition-all hover:shadow-md`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-3 shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {typeof stat.value === "number" ? stat.value.toLocaleString("vi-VN") : stat.value}
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.suffix}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Progress Section */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
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

          {/* Payment History Section */}
          {payrollHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
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
        </>
      )}
    </div>
  )
}
