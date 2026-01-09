"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Clock, CheckCircle } from "lucide-react"
import NoteModal from "@/components/note-modal"
import AttendanceModal from "@/components/attendance-modal"

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
}

export default function NotePanel({
  selectedDate,
  dayNotes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
  hasWorkStarted,
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

  const getColorLabel = (color: string) => {
    const labels: Record<string, string> = {
      blue: "Xanh",
      red: "Đỏ",
      green: "Xanh lá",
      yellow: "Vàng",
      purple: "Tím",
      pink: "Hồng",
    }
    return labels[color] || color
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
    <div className="p-6 h-full flex flex-col">
      {/* Date Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{formattedDate}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {dayNotes.length} mục{dayNotes.length !== 1 ? "" : ""}
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "all"
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "notes"
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
        >
          Ghi chú
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "attendance"
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
        >
          Điểm danh
        </button>
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
          <div className="space-y-3">
            {filteredNotes.map((note) => {
              const colorClasses: Record<string, { border: string; bg: string }> = {
                blue: { border: "border-l-blue-500", bg: "bg-blue-50/50 dark:bg-blue-900/20" },
                red: { border: "border-l-red-500", bg: "bg-red-50/50 dark:bg-red-900/20" },
                green: { border: "border-l-green-500", bg: "bg-green-50/50 dark:bg-green-900/20" },
                yellow: { border: "border-l-yellow-500", bg: "bg-yellow-50/50 dark:bg-yellow-900/20" },
                purple: { border: "border-l-purple-500", bg: "bg-purple-50/50 dark:bg-purple-900/20" },
                pink: { border: "border-l-pink-500", bg: "bg-pink-50/50 dark:bg-pink-900/20" },
              }

              const colors = colorClasses[note.color || "blue"] || colorClasses.blue

              return (
                <Card
                  key={note.id}
                  className={`p-3 border-l-4 ${colors.border} ${colors.bg} backdrop-blur-sm cursor-pointer hover:shadow-md transition-all ${note.completed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 flex-1">
                      <div className="flex items-start gap-2 mb-1">
                        <button
                          onClick={() => handleToggleComplete(note.id, note.completed || false)}
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${note.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-slate-300 dark:border-slate-600 hover:border-green-500"
                            }`}
                        >
                          {note.completed && <span className="text-xs">✓</span>}
                        </button>
                        <p
                          onClick={() => handleEditNote(note)}
                          className={`text-sm font-medium flex-1 ${note.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}
                        >
                          {note.text}
                        </p>
                      </div>

                      {note.progress !== undefined && note.progress > 0 && (
                        <div className="mb-2 ml-7">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-slate-600 dark:text-slate-400">Tiến độ</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {note.progress}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all`}
                              style={{
                                width: `${note.progress}%`,
                                backgroundColor:
                                  note.color === "blue"
                                    ? "#3b82f6"
                                    : note.color === "red"
                                      ? "#ef4444"
                                      : note.color === "green"
                                        ? "#22c55e"
                                        : note.color === "yellow"
                                          ? "#eab308"
                                          : note.color === "purple"
                                            ? "#a855f7"
                                            : note.color === "pink"
                                              ? "#ec4899"
                                              : "#3b82f6",
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-7">
                        <Clock className="w-3 h-3" />
                        {note.timestamp}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              )
            })}
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
