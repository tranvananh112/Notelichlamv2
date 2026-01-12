"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Clock, CheckCircle, X, Edit3 } from "lucide-react"
import NoteModal from "@/components/note-modal"
import EnhancedRichNoteModal from "@/components/enhanced-rich-note-modal"
import NoteTemplates from "@/components/note-templates"
import AttendanceModal from "@/components/attendance-modal"
import ModernNoteCard from "@/components/modern-note-card"
import TaskToggleSwitch from "@/components/task-toggle-switch"
import RichNoteDisplay from "@/components/rich-note-display"

interface Note {
  id: string
  text: string
  timestamp: string
  type: "note" | "attendance"
  color?: string
  progress?: number
  completed?: boolean
  status?: string
}

interface NotePanelProps {
  selectedDate: Date
  dayNotes: Note[]
  onAddNote: (text: string, type: "note" | "attendance", color: string, progress?: number, customTimestamp?: string) => void
  onDeleteNote: (noteId: string) => void
  onUpdateNote: (
    noteId: string,
    updates: Partial<{ text: string; color: string; progress: number; completed: boolean; status: string }>,
  ) => void
  hasWorkStarted: boolean
  onClose?: () => void
  futureTasks: Array<{
    id: string
    text: string
    color?: string
    priority?: string
    status?: string
    completed?: boolean
    created_at: string
  }>
  onAddFutureTask: (text: string, color: string, priority: string) => void
  onDeleteFutureTask: (taskId: string) => void
  onUpdateFutureTask: (taskId: string, updates: Partial<{ text: string; color: string; priority: string; status: string; completed: boolean }>) => void
}

export default function NotePanel({
  selectedDate,
  dayNotes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  hasWorkStarted,
  onClose,
  futureTasks,
  onAddFutureTask,
  onDeleteFutureTask,
  onUpdateFutureTask,
}: NotePanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "notes" | "attendance" | "future">("all")
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showRichNoteModal, setShowRichNoteModal] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showFutureTaskModal, setShowFutureTaskModal] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ text: string; progress: number; status: string }>({ text: "", progress: 0, status: "planning" })
  const [editingFutureTaskId, setEditingFutureTaskId] = useState<string | null>(null)
  const [futureTaskValues, setFutureTaskValues] = useState<{ text: string; color: string; priority: string; status: string }>({
    text: "",
    color: "blue",
    priority: "medium",
    status: "planning"
  })
  const [editingRichNote, setEditingRichNote] = useState<Note | null>(null)

  const filteredNotes = dayNotes.filter((note) => {
    if (activeTab === "all") return true // HIỂN THỊ TẤT CẢ để đảm bảo không mất dữ liệu
    if (activeTab === "notes") return note.type === "note"
    if (activeTab === "attendance") return note.type === "attendance"
    if (activeTab === "future") return false // Future tasks không hiển thị ở đây
    return true
  })

  // Sắp xếp theo thời gian tạo (cũ nhất trước, mới nhất sau) - theo timestamp thực tế
  const sortedFilteredNotes = [...filteredNotes].sort((a, b) => {
    // Chuyển timestamp thành số để so sánh chính xác
    const parseTime = (timestamp: string) => {
      if (!timestamp) return 0

      // Nếu timestamp có format HH:MM:SS
      if (timestamp.includes(':')) {
        const parts = timestamp.split(':')
        const hours = parseInt(parts[0]) || 0
        const minutes = parseInt(parts[1]) || 0
        const seconds = parseInt(parts[2]) || 0

        // Chuyển thành tổng số giây từ 00:00:00
        return hours * 3600 + minutes * 60 + seconds
      }

      // Fallback: sử dụng created_at hoặc id
      return parseInt(timestamp) || 0
    }

    const timeA = parseTime(a.timestamp || a.id)
    const timeB = parseTime(b.timestamp || b.id)

    return timeA - timeB // Cũ nhất trước: 12:54:12 (46452s) < 14:34:57 (52497s)
  })

  const displayContent = activeTab === "future" ? futureTasks : sortedFilteredNotes

  const hasAttendance = dayNotes.some((note) => note.type === "attendance")

  // Thống kê
  const stats = {
    totalNotes: dayNotes.filter(n => n.type === "note").length,
    totalAttendance: dayNotes.filter(n => n.type === "attendance").length,
    completedNotes: dayNotes.filter(n => n.type === "note" && n.completed).length,
    avgProgress: dayNotes.filter(n => n.type === "note").length > 0
      ? Math.round(dayNotes.filter(n => n.type === "note").reduce((sum, n) => sum + (n.progress || 0), 0) / dayNotes.filter(n => n.type === "note").length)
      : 0,
    workShift: dayNotes.find(n => n.type === "attendance")?.text.includes("Cả ngày") ? "Cả ngày"
      : dayNotes.find(n => n.type === "attendance")?.text.includes("Buổi sáng") ? "Buổi sáng"
        : dayNotes.find(n => n.type === "attendance")?.text.includes("Buổi chiều") ? "Buổi chiều"
          : null
  }

  const weekDays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]
  const formattedDate = `${weekDays[selectedDate.getDay()]}, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`

  const handleMarkAttendance = (workType: "full" | "morning" | "afternoon", startTime: string, endTime: string) => {
    const attendanceText = `Có mặt - ${workType === "full" ? "Cả ngày" : workType === "morning" ? "Buổi sáng" : "Buổi chiều"} (${startTime} - ${endTime})`
    const timestamp = `${startTime}`
    onAddNote(attendanceText, "attendance", "green", undefined, timestamp)
    setShowAttendanceModal(false)
  }

  const handleEditNote = (note: Note) => {
    // Check if note contains rich text (HTML tags or formatted content)
    const hasRichText = note.text.includes('<') && note.text.includes('>') &&
      (note.text.includes('<b') || note.text.includes('<i') ||
        note.text.includes('<u') || note.text.includes('<font') ||
        note.text.includes('<span') || note.text.includes('<div') ||
        note.text.includes('style='))

    if (hasRichText) {
      // Open Rich Text Editor for rich notes
      setEditingRichNote(note)
    } else {
      // Open simple editor for plain text notes
      setEditingNoteId(note.id)
      setEditValues({ text: note.text, progress: note.progress || 0, status: note.status || "planning" })
    }
  }

  const handleSaveEdit = (noteId: string) => {
    onUpdateNote(noteId, { text: editValues.text, progress: editValues.progress, status: editValues.status })
    setEditingNoteId(null)
  }

  const handleToggleComplete = (noteId: string, currentStatus: boolean) => {
    onUpdateNote(noteId, { completed: !currentStatus })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Close Button */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{formattedDate}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {dayNotes.length} công việc
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 dark:hover:bg-slate-600 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Statistics Cards */}
        {hasAttendance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Work Shift */}
            <div className="bg-white/80 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-lg">
                    {stats.workShift === "Cả ngày" ? "🌞" : stats.workShift === "Buổi sáng" ? "🌅" : "🌆"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ca làm</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400 truncate">{stats.workShift}</p>
                </div>
              </div>
            </div>

            {/* Total Notes */}
            <div className="bg-white/80 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ghi chú</p>
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{stats.totalNotes}</p>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white/80 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hoàn thành</p>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{stats.completedNotes}/{stats.totalNotes}</p>
                </div>
              </div>
            </div>

            {/* Average Progress */}
            <div className="bg-white/80 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tiến độ TB</p>
                  <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{stats.avgProgress}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === "notes"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Ghi chú
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === "attendance"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Điểm danh
          </button>
          <button
            onClick={() => setActiveTab("future")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative ${activeTab === "future"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Nhiệm vụ dự kiến
            {futureTasks.filter(task => !task.completed).length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {futureTasks.filter(task => !task.completed).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Attendance Check-in */}
      {!hasAttendance && activeTab !== "notes" && activeTab !== "future" && (
        <div className="px-6 pb-4">
          <Button
            onClick={() => setShowAttendanceModal(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {hasWorkStarted ? "Điểm danh hôm nay" : "Bắt đầu làm việc"}
          </Button>
        </div>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "future" ? (
          // Future Tasks View
          displayContent.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                  Chưa có nhiệm vụ dự kiến
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Thêm ý tưởng công việc cho tương lai</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayContent.map((task: any) => {
                const priorityColors = {
                  low: { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-l-blue-500", text: "text-blue-600", badge: "bg-blue-500" },
                  medium: { bg: "bg-yellow-50 dark:bg-yellow-900/10", border: "border-l-yellow-500", text: "text-yellow-600", badge: "bg-yellow-500" },
                  high: { bg: "bg-red-50 dark:bg-red-900/10", border: "border-l-red-500", text: "text-red-600", badge: "bg-red-500" },
                }
                const priority = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium

                const statusConfig = {
                  planning: { label: "Đang lên kế hoạch", color: "bg-gray-500", icon: "📋" },
                  inProgress: { label: "Đang tiến hành", color: "bg-blue-500", icon: "⚡" },
                  working: { label: "Đang làm", color: "bg-orange-500", icon: "🔥" },
                  nearDone: { label: "Gần xong", color: "bg-purple-500", icon: "🚀" },
                  completed: { label: "Đã xong", color: "bg-green-500", icon: "✅" },
                }
                const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.planning

                return (
                  <Card key={task.id} className={`group relative overflow-hidden border-l-4 ${priority.border} ${priority.bg} hover:shadow-lg transition-all duration-300 ${task.completed ? 'opacity-75' : ''}`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`w-8 h-8 rounded-full ${task.completed ? 'bg-green-500' : status.color} flex items-center justify-center text-white shadow-md`}>
                            <span className="text-sm">{task.completed ? '✅' : status.icon}</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 overflow-hidden pr-2">
                          <div className={`text-sm font-medium mb-2 break-words ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                            <RichNoteDisplay
                              content={task.text}
                              className="rich-note-content"
                            />
                          </div>

                          {/* Priority badge */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full ${priority.badge} text-white text-xs font-medium`}>
                              {task.priority === "low" ? "Thấp" : task.priority === "high" ? "Cao" : "Trung bình"}
                            </span>
                            {task.completed && (
                              <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-medium">
                                Đã hoàn thành
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(task.created_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        {/* Toggle Switch và Actions */}
                        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
                          {/* Toggle Switch */}
                          <TaskToggleSwitch
                            completed={task.completed || false}
                            onChange={(completed) => onUpdateFutureTask(task.id, { completed })}
                          />

                          {/* Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingFutureTaskId(task.id)
                                setFutureTaskValues({
                                  text: task.text,
                                  color: task.color || "blue",
                                  priority: task.priority || "medium",
                                  status: task.status || "planning"
                                })
                              }}
                              className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-purple-500 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteFutureTask(task.id)}
                              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )
        ) : (
          // Regular Notes View
          filteredNotes.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-center">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                  {activeTab === "all" && "Chưa có ghi chú"}
                  {activeTab === "notes" && "Chưa có ghi chú công việc"}
                  {activeTab === "attendance" && "Chưa điểm danh"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Thêm ghi chú đầu tiên của bạn bên dưới</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <ModernNoteCard
                  key={note.id}
                  note={note}
                  onDelete={() => onDeleteNote(note.id)}
                  onToggleComplete={() => handleToggleComplete(note.id, note.completed || false)}
                  onEdit={() => note.type !== "attendance" && handleEditNote(note)}
                  onUpdateStatus={(status) => onUpdateNote(note.id, { status })}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Add Note Button */}
      <div className="p-6 pt-0 space-y-2">
        {activeTab === "future" ? (
          <Button
            onClick={() => setShowFutureTaskModal(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm nhiệm vụ dự kiến
          </Button>
        ) : (
          <div className="space-y-2">
            {/* Rich Text Editor Button - MẶC ĐỊNH */}
            <Button
              onClick={() => setShowRichNoteModal(true)}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg py-3 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Tạo ghi chú
            </Button>

            {/* Template Button */}
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
              className="w-full border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-semibold rounded-lg py-2 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Chọn Template
            </Button>
          </div>
        )}
      </div>

      {showNoteModal && (
        <NoteModal
          onAddNote={(text, color, progress) => {
            onAddNote(text, "note", color, progress)
            setShowNoteModal(false)
          }}
          onClose={() => setShowNoteModal(false)}
        />
      )}

      {showAttendanceModal && (
        <AttendanceModal
          onMarkAttendance={handleMarkAttendance}
          onClose={() => setShowAttendanceModal(false)}
        />
      )}

      {/* Modal chỉnh sửa ghi chú */}
      {editingNoteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white dark:bg-slate-800 p-6 w-full max-w-md rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Chỉnh sửa ghi chú</h3>

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
                    onClick={() => setEditValues({ ...editValues, text: editValues.text + bullet.symbol + " " })}
                    className="w-7 h-7 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
                    title={bullet.name}
                  >
                    {bullet.symbol}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={editValues.text}
              onChange={(e) => setEditValues({ ...editValues, text: e.target.value })}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white mb-3 resize-none leading-relaxed"
              placeholder="Chỉnh sửa nội dung ghi chú..."
              rows={5}
            />

            {/* Trạng thái */}
            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Trạng thái
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "planning", label: "Đang lên kế hoạch", color: "bg-gray-500", icon: "📋" },
                  { value: "inProgress", label: "Đang tiến hành", color: "bg-blue-500", icon: "⚡" },
                  { value: "working", label: "Đang làm", color: "bg-orange-500", icon: "🔥" },
                  { value: "nearDone", label: "Gần xong", color: "bg-purple-500", icon: "🚀" },
                  { value: "completed", label: "Đã xong", color: "bg-green-500", icon: "✅" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setEditValues({ ...editValues, status: s.value })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${editValues.status === s.value
                      ? `${s.color} text-white shadow-md`
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Tiến độ: {editValues.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editValues.progress}
                onChange={(e) => setEditValues({ ...editValues, progress: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setEditingNoteId(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleSaveEdit(editingNoteId)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600"
              >
                Lưu
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal thêm nhiệm vụ dự kiến - SỬ DỤNG RICH TEXT */}
      {showFutureTaskModal && (
        <EnhancedRichNoteModal
          onAddNote={(text, color, progress, priority, tags, category) => {
            onAddFutureTask(text, color, priority || "medium")
            setShowFutureTaskModal(false)
          }}
          onClose={() => setShowFutureTaskModal(false)}
          title="Thêm nhiệm vụ dự kiến"
        />
      )}

      {/* Modal chỉnh sửa nhiệm vụ dự kiến - SỬ DỤNG RICH TEXT */}
      {editingFutureTaskId && (() => {
        const task = futureTasks.find(t => t.id === editingFutureTaskId)
        if (!task) return null

        return (
          <EnhancedRichNoteModal
            isEditing={true}
            initialData={{
              text: task.text,
              color: task.color || "blue",
              progress: 0,
              priority: task.priority || "medium",
              tags: [],
              category: "work"
            }}
            onAddNote={(text, color, progress, priority, tags, category) => {
              if (editingFutureTaskId) {
                onUpdateFutureTask(editingFutureTaskId, {
                  text,
                  color,
                  priority: priority || "medium",
                  status: task.status || "planning"
                })
              }
              setEditingFutureTaskId(null)
            }}
            onClose={() => setEditingFutureTaskId(null)}
            title="Chỉnh sửa nhiệm vụ dự kiến"
          />
        )
      })()}

      {/* Rich Text Note Modal */}
      {showRichNoteModal && (
        <EnhancedRichNoteModal
          onAddNote={(text, color, progress, priority, tags, category) => {
            onAddNote(text, "note", color, progress)
            setShowRichNoteModal(false)
          }}
          onClose={() => setShowRichNoteModal(false)}
        />
      )}

      {/* Rich Text Edit Modal */}
      {editingRichNote && (
        <EnhancedRichNoteModal
          isEditing={true}
          initialData={{
            text: editingRichNote.text,
            color: editingRichNote.color || "blue",
            progress: editingRichNote.progress || 0,
            priority: "medium", // Default priority for existing notes
            tags: [], // Default empty tags
            category: "work" // Default category
          }}
          onAddNote={(text, color, progress, priority, tags, category) => {
            onUpdateNote(editingRichNote.id, {
              text,
              color,
              progress,
              status: editingRichNote.status || "planning"
            })
            setEditingRichNote(null)
          }}
          onClose={() => setEditingRichNote(null)}
        />
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <NoteTemplates
          onSelectTemplate={(template) => {
            setShowRichNoteModal(true)
            setShowTemplates(false)
            // You can pass template data to the rich note modal here
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  )
}
