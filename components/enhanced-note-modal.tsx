"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Tag, Calendar as CalendarIcon, Flag } from "lucide-react"

interface EnhancedNoteModalProps {
    onAddNote: (text: string, color: string, progress: number, priority?: string, tags?: string[]) => void
    onClose: () => void
}

export default function EnhancedNoteModal({ onAddNote, onClose }: EnhancedNoteModalProps) {
    const [noteText, setNoteText] = useState("")
    const [selectedColor, setSelectedColor] = useState("blue")
    const [progress, setProgress] = useState(0)
    const [priority, setPriority] = useState("medium")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")

    const colors = [
        { id: "blue", name: "Xanh dương", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-500", gradient: "from-blue-400 to-blue-600" },
        { id: "red", name: "Đỏ", bg: "bg-red-500", light: "bg-red-50", border: "border-red-500", gradient: "from-red-400 to-red-600" },
        { id: "green", name: "Xanh lá", bg: "bg-green-500", light: "bg-green-50", border: "border-green-500", gradient: "from-green-400 to-green-600" },
        { id: "yellow", name: "Vàng", bg: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-500", gradient: "from-yellow-400 to-yellow-600" },
        { id: "purple", name: "Tím", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-500", gradient: "from-purple-400 to-purple-600" },
        { id: "pink", name: "Hồng", bg: "bg-pink-500", light: "bg-pink-50", border: "border-pink-500", gradient: "from-pink-400 to-pink-600" },
    ]

    const priorities = [
        { id: "low", name: "Thấp", icon: "🟢", color: "text-green-600" },
        { id: "medium", name: "Trung bình", icon: "🟡", color: "text-yellow-600" },
        { id: "high", name: "Cao", icon: "🔴", color: "text-red-600" },
    ]

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleAddNote = () => {
        if (noteText.trim()) {
            onAddNote(noteText, selectedColor, progress, priority, tags)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tạo ghi chú mới</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Thêm công việc và theo dõi tiến độ</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Note Text Input */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Nội dung công việc
                        </label>

                        {/* Bullet Library */}
                        <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Bullet Library:</span>
                            </div>
                            <div className="grid grid-cols-8 gap-1">
                                {[
                                    { symbol: "•", name: "Bullet" },
                                    { symbol: "○", name: "Circle" },
                                    { symbol: "■", name: "Square" },
                                    { symbol: "▲", name: "Triangle" },
                                    { symbol: "★", name: "Star" },
                                    { symbol: "♦", name: "Diamond" },
                                    { symbol: "→", name: "Arrow" },
                                    { symbol: "✓", name: "Check" },
                                    { symbol: "✗", name: "Cross" },
                                    { symbol: "!", name: "Important" },
                                    { symbol: "?", name: "Question" },
                                    { symbol: "※", name: "Note" },
                                    { symbol: "⚡", name: "Priority" },
                                    { symbol: "🔥", name: "Hot" },
                                    { symbol: "💡", name: "Idea" },
                                    { symbol: "📝", name: "Task" },
                                ].map((bullet) => (
                                    <button
                                        key={bullet.symbol}
                                        onClick={() => setNoteText(prev => prev + bullet.symbol + " ")}
                                        className="w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
                                        title={bullet.name}
                                    >
                                        {bullet.symbol}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Mô tả chi tiết công việc cần làm...&#10;• Sử dụng bullet points để tổ chức ý tưởng&#10;• Click vào Bullet Library ở trên để thêm ký hiệu&#10;• Viết chi tiết để dễ theo dõi"
                            className="w-full p-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent resize-none transition-all leading-relaxed"
                            rows={6}
                            style={{ minHeight: '150px' }}
                        />
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                            <span>Sử dụng bullet points để tổ chức nội dung</span>
                            <span>{noteText.length} ký tự</span>
                        </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                            <Flag className="w-4 h-4" />
                            Mức độ ưu tiên
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {priorities.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPriority(p.id)}
                                    className={`
                    p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex items-center justify-center gap-2
                    ${priority === p.id
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg"
                                            : "border-slate-200 dark:border-slate-600 hover:border-purple-300"
                                        }
                  `}
                                >
                                    <span className="text-2xl">{p.icon}</span>
                                    <span className={`text-sm font-semibold ${p.color}`}>{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Chọn màu nhãn</label>
                        <div className="grid grid-cols-6 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    onClick={() => setSelectedColor(color.id)}
                                    className={`
                    relative w-full aspect-square rounded-xl transition-all transform hover:scale-110
                    bg-gradient-to-br ${color.gradient}
                    ${selectedColor === color.id ? "ring-4 ring-offset-2 ring-slate-800 dark:ring-offset-slate-800 scale-110 shadow-xl" : "shadow-md"}
                  `}
                                    title={color.name}
                                >
                                    {selectedColor === color.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Thẻ tag (tùy chọn)
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                placeholder="Nhập tag và nhấn Enter..."
                                className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <Button onClick={handleAddTag} className="bg-purple-500 hover:bg-purple-600">
                                Thêm
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-purple-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress Tracking */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiến độ hoàn thành</label>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{progress}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                            style={{
                                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${progress}%, rgb(226, 232, 240) ${progress}%, rgb(226, 232, 240) 100%)`
                            }}
                        />
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <span>Chưa bắt đầu</span>
                            <span>Đang thực hiện</span>
                            <span>Hoàn thành</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white bg-transparent h-12"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleAddNote}
                            disabled={!noteText.trim()}
                            className="flex-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed h-12 shadow-lg"
                        >
                            Tạo ghi chú
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
