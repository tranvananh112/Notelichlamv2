"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Clock } from "lucide-react"

interface AttendanceModalProps {
    onMarkAttendance: (workType: "full" | "morning" | "afternoon", startTime: string, endTime: string) => void
    onClose: () => void
}

export default function AttendanceModal({ onMarkAttendance, onClose }: AttendanceModalProps) {
    const [workType, setWorkType] = useState<"full" | "morning" | "afternoon">("full")
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("17:00")

    const workTypes = [
        { id: "full", name: "Cả ngày", start: "08:00", end: "17:00", icon: "🌞" },
        { id: "morning", name: "Buổi sáng", start: "08:00", end: "12:00", icon: "🌅" },
        { id: "afternoon", name: "Buổi chiều", start: "13:00", end: "17:00", icon: "🌆" },
    ]

    const handleWorkTypeChange = (type: "full" | "morning" | "afternoon") => {
        setWorkType(type)
        const selected = workTypes.find((t) => t.id === type)
        if (selected) {
            setStartTime(selected.start)
            setEndTime(selected.end)
        }
    }

    const handleConfirm = () => {
        onMarkAttendance(workType, startTime, endTime)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-md w-full shadow-2xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-green-500" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Điểm danh làm việc</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Work Type Selection */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                            Chọn ca làm việc
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {workTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleWorkTypeChange(type.id as "full" | "morning" | "afternoon")}
                                    className={`
                    p-4 rounded-xl border-2 transition-all transform hover:scale-105
                    ${workType === type.id
                                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
                                            : "border-slate-200 dark:border-slate-600 hover:border-green-300"
                                        }
                  `}
                                >
                                    <div className="text-3xl mb-2">{type.icon}</div>
                                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{type.name}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                        {type.start} - {type.end}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Time Selection */}
                    <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">
                            Tùy chỉnh giờ làm việc
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Giờ bắt đầu</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Giờ kết thúc</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 dark:text-slate-300">Thời gian làm việc:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                {startTime} - {endTime}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-slate-700 dark:text-slate-300">Ca làm việc:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                {workTypes.find((t) => t.id === workType)?.name}
                            </span>
                        </div>
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
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
                        >
                            Xác nhận điểm danh
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
