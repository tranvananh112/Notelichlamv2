"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, DollarSign } from "lucide-react"

interface PayrollModalProps {
  daysWorked: number
  onConfirm: (amount: number) => void
  onClose: () => void
}

export default function PayrollModal({ daysWorked, onConfirm, onClose }: PayrollModalProps) {
  const [salaryAmount, setSalaryAmount] = useState<number>(3000000)
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (salaryAmount > 0) {
      setConfirmed(true)
      setTimeout(() => {
        onConfirm(salaryAmount)
      }, 800)
    }
  }

  if (confirmed) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-md w-full animate-in fade-in scale-95">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thanh toán thành công!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Bạn đã nhận được {salaryAmount.toLocaleString("vi-VN")}đ cho {daysWorked} ngày làm việc.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">Chu kỳ làm việc mới sẽ bắt đầu.</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-md w-full">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thanh toán lương</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Đã hoàn thành 30 ngày</p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Bạn đã hoàn thành <span className="font-bold text-blue-600 dark:text-blue-400">{daysWorked} ngày</span>{" "}
              làm việc và sẵn sàng nhận lương.
            </p>
          </div>

          {/* Salary Input */}
          <div className="space-y-3 mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nhập số tiền lương (đ)</label>
            <input
              type="number"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400"
              placeholder="Nhập số tiền"
              min="0"
              step="100000"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white bg-transparent"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={salaryAmount <= 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận thanh toán
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
