"use client"

import { Trash2, Clock, CheckCircle2, Edit3, MoreVertical } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface ModernNoteCardProps {
    note: {
        id: string
        text: string
        timestamp: string
        type: "note" | "attendance"
        color?: string
        progress?: number
        completed?: boolean
        status?: string
    }
    onDelete: () => void
    onToggleComplete: () => void
    onEdit: () => void
    onUpdateStatus?: (status: string) => void
}

export default function ModernNoteCard({ note, onDelete, onToggleComplete, onEdit, onUpdateStatus }: ModernNoteCardProps) {
    const [showMenu, setShowMenu] = useState(false)

    const colorStyles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
        blue: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-l-blue-500", text: "text-blue-700 dark:text-blue-300", badge: "bg-blue-500" },
        red: { bg: "bg-red-50 dark:bg-red-900/10", border: "border-l-red-500", text: "text-red-700 dark:text-red-300", badge: "bg-red-500" },
        green: { bg: "bg-green-50 dark:bg-green-900/10", border: "border-l-green-500", text: "text-green-700 dark:text-green-300", badge: "bg-green-500" },
        yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/10", border: "border-l-yellow-500", text: "text-yellow-700 dark:text-yellow-300", badge: "bg-yellow-500" },
        purple: { bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-l-purple-500", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-500" },
        pink: { bg: "bg-pink-50 dark:bg-pink-900/10", border: "border-l-pink-500", text: "text-pink-700 dark:text-pink-300", badge: "bg-pink-500" },
    }

    const colors = colorStyles[note.color || "blue"] || colorStyles.blue

    const getWorkIcon = (text: string) => {
        if (text.includes("Cả ngày")) return "🌞"
        if (text.includes("Buổi sáng")) return "🌅"
        if (text.includes("Buổi chiều")) return "🌆"
        return "✓"
    }

    const getStatusOptions = () => ({
        planning: { label: "Đang lên kế hoạch", color: "bg-gray-500", icon: "📋" },
        inProgress: { label: "Đang tiến hành", color: "bg-blue-500", icon: "⚡" },
        working: { label: "Đang làm", color: "bg-orange-500", icon: "🔥" },
        nearDone: { label: "Gần xong", color: "bg-purple-500", icon: "🚀" },
        completed: { label: "Đã xong", color: "bg-green-500", icon: "✅" },
    })

    const getStatusConfig = (status: string) => {
        const options = getStatusOptions()
        return options[status as keyof typeof options] || options.planning
    }

    if (note.type === "attendance") {
        return (
            <Card className={`group relative overflow-hidden border-l-4 ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left`}>
                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                            <span className="text-2xl">{getWorkIcon(note.text)}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <h4 className="font-semibold text-green-700 dark:text-green-300 text-base mb-1 break-words">
                                {note.text}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{note.timestamp}</span>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={onDelete}
                            className="flex-shrink-0 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className={`group relative overflow-hidden border-l-4 ${colors.border} ${colors.bg} hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left`}>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    {note.status && (
                        <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-8 h-8 rounded-full ${getStatusConfig(note.status).color} flex items-center justify-center text-white shadow-md`}>
                                <span className="text-sm">{getStatusConfig(note.status).icon}</span>
                            </div>
                        </div>
                    )}

                    {/* Checkbox */}
                    <button
                        onClick={onToggleComplete}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${note.completed
                            ? `${colors.badge} border-transparent text-white scale-110`
                            : "border-slate-300 dark:border-slate-600 hover:border-purple-500"
                            }`}
                    >
                        {note.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0 overflow-hidden pr-2">
                        <p className={`text-sm font-medium mb-2 break-words whitespace-pre-wrap ${note.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                            {note.text}
                        </p>

                        {/* Status Badge */}
                        {note.status && (
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`px-2 py-1 rounded-full ${getStatusConfig(note.status).color} text-white text-xs font-medium shadow-sm`}>
                                    {getStatusConfig(note.status).label}
                                </span>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {note.progress !== undefined && note.progress > 0 && (
                            <div className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Tiến độ</span>
                                    <span className={`text-xs font-bold ${colors.text}`}>{note.progress}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${colors.badge} transition-all duration-500 rounded-full`}
                                        style={{ width: `${note.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{note.timestamp}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-1">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={onEdit}
                                className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-purple-500 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Quick Status Change */}
                        {onUpdateStatus && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {Object.entries(getStatusOptions()).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => onUpdateStatus(key)}
                                        className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center text-white text-xs hover:scale-110 transition-transform ${note.status === key ? 'ring-2 ring-white' : ''}`}
                                        title={config.label}
                                    >
                                        {config.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Completed Badge */}
            {note.completed && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        Hoàn thành
                    </span>
                </div>
            )}
        </Card>
    )
}
