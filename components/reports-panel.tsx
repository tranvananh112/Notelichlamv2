"use client"

import { Calendar, CheckCircle, FileText, TrendingUp } from "lucide-react"

interface ReportsPanelProps {
  daysWorked: number
  workStartDate: Date | null
  payrollHistory: Array<{ date: string; amount: number }>
  notes: Record<string, Array<{ id: string; text: string; timestamp: string; type: "note" | "attendance" }>>
}

export default function ReportsPanel({ daysWorked, workStartDate, payrollHistory, notes }: ReportsPanelProps) {
  const totalNotes = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + dayNotes.filter((n) => n.type === "note").length
  }, 0)

  const totalAttendance = Object.values(notes).reduce((sum, dayNotes) => {
    return sum + (dayNotes.some((n) => n.type === "attendance") ? 1 : 0)
  }, 0)

  const totalEarned = payrollHistory.reduce((sum, payment) => sum + payment.amount, 0)
  const progressPercentage = Math.min((daysWorked / 30) * 100, 100)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thống kê công việc</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Theo dõi tiến độ và lương của bạn</p>
      </div>

      {/* Stats Grid - 2x2 with clean design */}
      <div className="grid grid-cols-2 gap-4">
        {/* Days Worked */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Ngày làm việc</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{daysWorked}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Trên tổng 30 ngày</p>
        </div>

        {/* Total Notes */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Ghi chú công việc</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalNotes}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Đã ghi lại</p>
        </div>

        {/* Check-ins */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Điểm danh</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalAttendance}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Ngày đi làm</p>
        </div>

        {/* Total Earned */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Tổng lương</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalEarned.toLocaleString()}</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{payrollHistory.length} lần nhận</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiến độ nhận lương</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
          {daysWorked === 30 ? "Sẵn sàng nhận lương!" : `Còn ${30 - daysWorked} ngày nữa để nhận lương`}
        </p>
      </div>

      {/* Payment History */}
      {payrollHistory.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Lịch sử thanh toán</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {payrollHistory.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(payment.date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Thanh toán</p>
                </div>
                <p className="font-bold text-green-600 dark:text-green-400">
                  {payment.amount.toLocaleString("vi-VN")}đ
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Status */}
      {workStartDate && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-sm">
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Bắt đầu:</span>{" "}
            {new Date(workStartDate).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  )
}
