"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Save, FileText, Palette, Flag, Tag, Calendar, Smile } from "lucide-react"
import UltraFastRichEditorV2 from "./ultra-fast-rich-editor-v2"
import RiveIconPicker from "./rive-icon-picker"

interface EnhancedRichNoteModalProps {
    onAddNote: (text: string, color: string, progress: number, priority?: string, tags?: string[], category?: string) => void
    onClose: () => void
    initialData?: {
        text?: string
        color?: string
        progress?: number
        priority?: string
        tags?: string[]
        category?: string
    }
    isEditing?: boolean
    title?: string
}

const CATEGORIES = [
    { id: "work", name: "Công việc", icon: "💼", color: "bg-blue-500" },
    { id: "personal", name: "Cá nhân", icon: "👤", color: "bg-green-500" },
    { id: "study", name: "Học tập", icon: "📚", color: "bg-purple-500" },
    { id: "health", name: "Sức khỏe", icon: "🏥", color: "bg-red-500" },
    { id: "finance", name: "Tài chính", icon: "💰", color: "bg-yellow-500" },
    { id: "family", name: "Gia đình", icon: "👨‍👩‍👧‍👦", color: "bg-pink-500" },
    { id: "hobby", name: "Sở thích", icon: "🎨", color: "bg-indigo-500" },
    { id: "travel", name: "Du lịch", icon: "✈️", color: "bg-cyan-500" },
]

const COLORS = [
    { id: "blue", name: "Xanh dương", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-500" },
    { id: "green", name: "Xanh lá", bg: "bg-green-500", light: "bg-green-50", border: "border-green-500" },
    { id: "purple", name: "Tím", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-500" },
    { id: "red", name: "Đỏ", bg: "bg-red-500", light: "bg-red-50", border: "border-red-500" },
    { id: "yellow", name: "Vàng", bg: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-500" },
    { id: "pink", name: "Hồng", bg: "bg-pink-500", light: "bg-pink-50", border: "border-pink-500" },
    { id: "indigo", name: "Chàm", bg: "bg-indigo-500", light: "bg-indigo-50", border: "border-indigo-500" },
    { id: "gray", name: "Xám", bg: "bg-gray-500", light: "bg-gray-50", border: "border-gray-500" },
]

const PRIORITIES = [
    { id: "low", name: "Thấp", icon: "🟢", color: "text-green-600 bg-green-50" },
    { id: "medium", name: "Trung bình", icon: "🟡", color: "text-yellow-600 bg-yellow-50" },
    { id: "high", name: "Cao", icon: "🔴", color: "text-red-600 bg-red-50" },
    { id: "urgent", name: "Khẩn cấp", icon: "🚨", color: "text-red-800 bg-red-100" },
]

export default function EnhancedRichNoteModal({
    onAddNote,
    onClose,
    initialData,
    isEditing = false,
    title
}: EnhancedRichNoteModalProps) {
    const [noteContent, setNoteContent] = useState(initialData?.text || "")
    const [selectedColor, setSelectedColor] = useState(initialData?.color || "blue")
    const [progress, setProgress] = useState(initialData?.progress || 0)
    const [priority, setPriority] = useState(initialData?.priority || "medium")
    const [category, setCategory] = useState(initialData?.category || "work")
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [tagInput, setTagInput] = useState("")
    const [activeTab, setActiveTab] = useState<"content" | "format" | "details">("content")
    const [showIconPicker, setShowIconPicker] = useState(false)

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    const handleSave = () => {
        if (noteContent.trim()) {
            onAddNote(noteContent, selectedColor, progress, priority, tags, category)
        }
    }

    const selectedColorData = COLORS.find(c => c.id === selectedColor) || COLORS[0]
    const selectedCategoryData = CATEGORIES.find(c => c.id === category) || CATEGORIES[0]
    const selectedPriorityData = PRIORITIES.find(p => p.id === priority) || PRIORITIES[1]

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${selectedColorData.bg} flex items-center justify-center shadow-md`}>
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {title || (initialData ? "Chỉnh sửa ghi chú" : "Tạo ghi chú mới")}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {initialData ? "Cập nhật nội dung với công cụ định dạng" : "Sử dụng công cụ định dạng để tạo ghi chú đẹp mắt"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/50 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    {[
                        { id: "content", name: "Nội dung", icon: FileText },
                        { id: "format", name: "Định dạng", icon: Palette },
                        { id: "details", name: "Chi tiết", icon: Tag },
                    ].map(({ id, name, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as any)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${activeTab === id
                                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-white dark:bg-slate-700"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                    {activeTab === "content" && (
                        <div className="p-6">
                            {/* Icon Button */}
                            <div className="mb-4 flex justify-end">
                                <Button
                                    onClick={() => setShowIconPicker(true)}
                                    variant="outline"
                                    className="border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-semibold"
                                >
                                    <Smile className="w-4 h-4 mr-2" />
                                    Thêm Icon
                                </Button>
                            </div>

                            <UltraFastRichEditorV2
                                value={noteContent}
                                onChange={setNoteContent}
                                placeholder={initialData ? "Chỉnh sửa nội dung ghi chú..." : "Bắt đầu viết ghi chú của bạn... Sử dụng thanh công cụ để định dạng văn bản."}
                                minHeight={300}
                            />
                        </div>
                    )}

                    {activeTab === "format" && (
                        <div className="p-6 space-y-6">
                            {/* Color Selection */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Màu sắc ghi chú
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => setSelectedColor(color.id)}
                                            className={`
                        relative p-4 rounded-xl border-2 transition-all transform hover:scale-105
                        ${selectedColor === color.id
                                                    ? `${color.border} ${color.light} shadow-lg scale-105`
                                                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
                                                }
                      `}
                                        >
                                            <div className={`w-8 h-8 rounded-lg ${color.bg} mx-auto mb-2 shadow-md`} />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                {color.name}
                                            </span>
                                            {selectedColor === color.id && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Danh mục
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`
                        relative p-3 rounded-xl border-2 transition-all transform hover:scale-105 text-left
                        ${category === cat.id
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105"
                                                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{cat.icon}</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            {category === cat.id && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="p-6 space-y-6">
                            {/* Priority Selection */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                    <Flag className="w-4 h-4" />
                                    Mức độ ưu tiên
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PRIORITIES.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPriority(p.id)}
                                            className={`
                        p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex items-center gap-3
                        ${priority === p.id
                                                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-105"
                                                    : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
                                                }
                      `}
                                        >
                                            <span className="text-2xl">{p.icon}</span>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {p.name}
                                                </div>
                                                <div className={`text-xs px-2 py-1 rounded-full ${p.color} mt-1 inline-block`}>
                                                    Mức độ {p.name.toLowerCase()}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Tracking */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full" />
                                        Tiến độ hoàn thành
                                    </label>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {progress}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={progress}
                                    onChange={(e) => setProgress(Number(e.target.value))}
                                    className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer"
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

                            {/* Tags Input */}
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Thẻ tag
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
                                                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2 border border-purple-200 dark:border-purple-700"
                                            >
                                                #{tag}
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${selectedColorData.bg}`} />
                                <span>{selectedColorData.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{selectedCategoryData.icon}</span>
                                <span>{selectedCategoryData.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{selectedPriorityData.icon}</span>
                                <span>{selectedPriorityData.name}</span>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    <span>{tags.length} tag{tags.length > 1 ? 's' : ''}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!noteContent.trim()}
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {initialData ? "Cập nhật" : "Tạo ghi chú"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Icon Picker Modal */}
            {showIconPicker && (
                <RiveIconPicker
                    onSelectIcon={(iconHtml) => {
                        setNoteContent(noteContent + iconHtml)
                        setShowIconPicker(false)
                    }}
                    onClose={() => setShowIconPicker(false)}
                />
            )}
        </div>
    )
}