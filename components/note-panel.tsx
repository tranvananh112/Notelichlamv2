"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Clock, CheckCircle, X } from "lucide-react"
import NoteModal from "@/components/note-modal"
import AttendanceModal from "@/components/attendance-modal"
import ModernNoteCard from "@/components/modern-note-card"

interface Note {
  id: string
  text: string
  timestamp: string
  type: "note" | "attendance"
  color?: string
  progress?: number
  completed?: boolean
}

interface NotePanelProps {
  selectedDate: Date
  dayNotes: Note[]
  onAddNote: (text: string, type: "note" | "attendance", color: string, progress?: number, customTimestamp?: string) => void
  onDeleteNote: (noteId: string) => void
  onUpdateNote: (
    noteId: string,
    updates: Partial<{ text: string; color: string; progress: number; completed: boolean }>,
  ) => void
  hasWorkStarted: boolean
  onClose?: () => void
}

export default function NotePanel({
  selectedDate,
  dayNotes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  hasWorkStarted,
  onClose,
}: NotePanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "notes" | "attendance">("all")
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ text: string; progress: number }>({ text: "", progress: 0 })

  const filteredNotes = dayNotes.filter((note) => {
    if (activeTab === "all") return true
    if (activeTab === "notes") return note.type === "note"
    if (activeTab === "attendance") return note.type === "attendance"
    return true
  })

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
    setEditingNoteId(note.id)
    setEditValues({ text: note.text, progress: note.progress || 0 })
  }

  const handleSaveEdit = (noteId: string) => {
    onUpdateNote(noteId, { text: editValues.text, progress: editValues.progress })
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
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "all"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "notes"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Ghi chú
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "attendance"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
              }`}
          >
            Điểm danh
          </button>
        </div>
      </div>

      {/* Attendance Check-in */}
      {!hasAttendance && activeTab !== "notes" && (
        <Button
          onClick={() => setShowAttendanceModal(true)}
          className="w-full mb-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {hasWorkStarted ? "Điểm danh hôm nay" : "Bắt đầu làm việc"}
        </Button>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto mb-4">
        {filteredNotes.length === 0 ? (
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
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <ModernNoteCard
                key={note.id}
                note={note}
                onDelete={() => onDeleteNote(note.id)}
                onToggleComplete={() => handleToggleComplete(note.id, note.completed || false)}
                onEdit={() => note.type !== "attendance" && handleEditNote(note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Note Button */}
      <div className="space-y-2">
        <Button
          onClick={() => setShowNoteModal(true)}
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg py-2 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm ghi chú
        </Button>
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
            <textarea
              value={editValues.text}
              onChange={(e) => setEditValues({ ...editValues, text: e.target.value })}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white mb-3 resize-none h-24"
              placeholder="Chỉnh sửa nội dung ghi chú..."
            />
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
    </div>
  )
}
