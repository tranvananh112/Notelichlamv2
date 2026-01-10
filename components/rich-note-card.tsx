"use client"

import { memo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Clock,
    Edit3,
    Trash2,
    CheckCircle,
    Circle,
    Flag,
    Tag,
    Calendar,
    Eye,
    EyeOff,
    Copy,
    Share2,
    MoreHorizontal
} from "lucide-react"

interface RichNote {
    id: string
    text: string
    timestamp: string
    type: "note" | "attendance"
    color?: string
    progress?: number
    completed?: boolean
    status?: string
    priority?: string
    category?: string
    tags?: string[]
}

interface RichNoteCardProps {
    note: RichNote
    onDelete: () => void
    onToggleComplete: () => void
    onEdit: () => void
    onUpdateStatus?: (status: string) => void
    compact?: boolean
}

const CATEGORIES = {
    work: { name: "Công việc", icon: "💼", color: "bg-blue-500" },
    personal: { name: "Cá nhân", icon: "👤", color: "bg-green-500" },
    study: { name: "Học tập", icon: "📚", color: "bg-purple-500" },
    health: { name: "Sức khỏe", icon: "🏥", color: "bg-red-500" },
    finance: { name: "Tài chính", icon: "💰", color: "bg-yellow-500" },
    family: { name: "Gia đình", icon: "👨‍👩‍👧‍👦", color: "bg-pink-500" },
    hobby: { name: "Sở thích", icon: "🎨", color: "bg-indigo-500" },
    travel: { name: "Du lịch", icon: "✈️", color: "bg-cyan-500" },
}

const PRIORITIES = {
    low: { name: "Thấp", icon: "🟢", color: "text-green-600 bg-green-50" },
    medium: { name: "Trung bình", icon: "🟡", color: "text-yellow-600 bg-yellow-50" },
    high: { name: "Cao", icon: "🔴", color: "text-red-600 bg-red-50" },
    urgent: { name: "Khẩn cấp", icon: "🚨", color: "text-red-800 bg-red-100" },
}

const STATUS_CONFIG = {
    planning: { label: "Đang lên kế hoạch", color: "bg-gray-500", icon: "📋" },
    inProgress: { label: "Đang tiến hành", color: "bg-blue-500", icon: "⚡" },
    working: { label: "Đang làm", color: "bg-orange-500", icon: "🔥" },
    nearDone: { label: "Gần xong", color: "bg-purple-500", icon: "🚀" },
    completed: { label: "Đã xong", color: "bg-green-500", icon: "✅" },
}

const RichNoteCard = memo(({
    note,
    onDelete,
    onToggleComplete,
    onEdit,
    onUpdateStatus,
    compact = false
}: RichNoteCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showActions, setShowActions] = useState(false)

    const colorClasses = {
        blue: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-l-blue-500", accent: "text-blue-600" },
        green: { bg: "bg-green-50 dark:bg-green-900/10", border: "border-l-green-500", accent: "text-green-600" },
        purple: { bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-l-purple-500", accent: "text-purple-600" },
        red: { bg: "bg-red-50 dark:bg-red-900/10", border: "border-l-red-500", accent: "text-red-600" },
        yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/10", border: "border-l-yellow-500", accent: "text-yellow-600" },
        pink: { bg: "bg-pink-50 dark:bg-pink-900/10", border: "border-l-pink-500", accent: "text-pink-600" },
        indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/10", border: "border-l-indigo-500", accent: "text-indigo-600" },
        gray: { bg: "bg-gray-50 dark:bg-gray-900/10", border: "border-l-gray-500", accent: "text-gray-600" },
    }

    const colors = colorClasses[note.color as keyof typeof colorClasses] || colorClasses.blue
    const category = note.category ? CATEGORIES[note.category as keyof typeof CATEGORIES] : null
    const priority = note.priority ? PRIORITIES[note.priority as keyof typeof PRIORITIES] : null
    const status = note.status ? STATUS_CONFIG[note.status as keyof typeof STATUS_CONFIG] : null

    const handleCopy = async () => {
        try {
            // Create a temporary div to extract plain text from HTML
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = note.text
            const plainText = tempDiv.textContent || tempDiv.innerText || ''

            await navigator.clipboard.writeText(plainText)
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text:', err)
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                const tempDiv = document.createElement('div')
                tempDiv.innerHTML = note.text
                const plainText = tempDiv.textContent || tempDiv.innerText || ''

                await navigator.share({
                    title: 'Ghi chú',
                    text: plainText,
                })
            } catch (err) {
                console.error('Failed to share:', err)
            }
        }
    }

    // Truncate HTML content for preview
    const getTruncatedContent = (html: string, maxLength: number = 150) => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html
        const text = tempDiv.textContent || tempDiv.innerText || ''
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    const shouldTruncate = note.text.length > 200
    const displayContent = isExpanded || !shouldTruncate ? note.text : getTruncatedContent(note.text)

    return (
        <Card className={`
      group relative overflow-hidden border-l-4 transition-all duration-300 hover:shadow-lg
      ${colors.border} ${colors.bg}
      ${note.completed ? 'opacity-75' : ''}
      ${compact ? 'p-3' : 'p-4'}
    `}>
            <div className="flex items-start gap-3">
                {/* Completion Toggle */}
                <button
                    onClick={onToggleComplete}
                    className="flex-shrink-0 mt-1 transition-colors hover:scale-110"
                    title={note.completed ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}
                >
                    {note.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-green-500" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    {/* Header with metadata */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {/* Category */}
                        {category && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 text-xs">
                                <span>{category.icon}</span>
                                <span className="font-medium">{category.name}</span>
                            </div>
                        )}

                        {/* Priority */}
                        {priority && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                                <span>{priority.icon}</span>
                                <span>{priority.name}</span>
                            </div>
                        )}

                        {/* Status */}
                        {status && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium ${status.color}`}>
                                <span>{status.icon}</span>
                                <span>{status.label}</span>
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                            <Clock className="w-3 h-3" />
                            <span>{note.timestamp}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                        {isExpanded || !shouldTruncate ? (
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert text-slate-900 dark:text-white"
                                dangerouslySetInnerHTML={{ __html: note.text }}
                            />
                        ) : (
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {displayContent}
                            </p>
                        )}

                        {shouldTruncate && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`text-xs font-medium mt-2 flex items-center gap-1 ${colors.accent} hover:underline`}
                            >
                                {isExpanded ? (
                                    <>
                                        <EyeOff className="w-3 h-3" />
                                        Thu gọn
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3 h-3" />
                                        Xem thêm
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {note.progress !== undefined && note.progress > 0 && (
                        <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                                <span>Tiến độ</span>
                                <span className="font-medium">{note.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${note.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                        }`}
                                    style={{ width: `${note.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {note.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                                >
                                    <Tag className="w-2.5 h-2.5" />
                                    {tag}
                                </span>
                            ))}
                            {note.tags.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                    +{note.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex flex-col gap-1">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-500 transition-colors"
                            title="Sao chép"
                        >
                            <Copy className="w-4 h-4" />
                        </button>

                        {navigator.share && (
                            <button
                                onClick={handleShare}
                                className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-green-500 transition-colors"
                                title="Chia sẻ"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        )}

                        <button
                            onClick={onEdit}
                            className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-purple-500 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onDelete}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                            title="Xóa"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Status Change */}
                    {onUpdateStatus && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => onUpdateStatus(key)}
                                    className={`w-6 h-6 rounded-full ${config.color} flex items-center justify-center text-white text-xs hover:scale-110 transition-transform ${note.status === key ? 'ring-2 ring-white' : ''
                                        }`}
                                    title={config.label}
                                >
                                    {config.icon}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
})

RichNoteCard.displayName = "RichNoteCard"

export default RichNoteCard