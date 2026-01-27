"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

interface SpecialDayModalProps {
    date: Date
    currentType: string | null
    onSave: (type: string | null) => void
    onClose: () => void
}

export default function SpecialDayModal({ date, currentType, onSave, onClose }: SpecialDayModalProps) {
    const [selectedType, setSelectedType] = useState<string | null>(currentType)

    const specialDayTypes = [
        { id: "tet", label: "Ngày Tết", icon: "🎊", color: "bg-red-500" },
        { id: "holiday", label: "Nghỉ Lễ", icon: "🎉", color: "bg-blue-500" },
        { id: "horse", label: "Ngày Đặc Biệt (Ngựa)", icon: "/ngựa.svg", color: "bg-yellow-500", isSvg: true },
        { id: "none", label: "Bỏ Đánh Dấu", icon: "❌", color: "bg-gray-400" },
    ]

    const handleSave = () => {
        onSave(selectedType === "none" ? null : selectedType)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white dark:bg-slate-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Đánh Dấu Ngày Đặc Biệt
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {date.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="space-y-3">
                    {specialDayTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`w-full p-4 rounded-lg border-2 transition-all ${selectedType === type.id
                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {type.isSvg ? (
                                    <img src={type.icon} alt={type.label} className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-2xl">{type.icon}</span>
                                )}
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-slate-800 dark:text-white">{type.label}</div>
                                </div>
                                <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 mt-6">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                        Lưu
                    </Button>
                </div>
            </Card>
        </div>
    )
}
