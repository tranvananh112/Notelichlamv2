"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface NoteModalProps {
  onAddNote: (text: string, color: string, progress: number) => void
  onClose: () => void
}

export default function NoteModal({ onAddNote, onClose }: NoteModalProps) {
  const [noteText, setNoteText] = useState("")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [progress, setProgress] = useState(0)

  const colors = [
    { id: "blue", name: "Xanh", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-500" },
    { id: "red", name: "Đỏ", bg: "bg-red-500", light: "bg-red-50", border: "border-red-500" },
    { id: "green", name: "Xanh lá", bg: "bg-green-500", light: "bg-green-50", border: "border-green-500" },
    { id: "yellow", name: "Vàng", bg: "bg-yellow-500", light: "bg-yellow-50", border: "border-yellow-500" },
    { id: "purple", name: "Tím", bg: "bg-purple-500", light: "bg-purple-50", border: "border-purple-500" },
    { id: "pink", name: "Hồng", bg: "bg-pink-500", light: "bg-pink-50", border: "border-pink-500" },
  ]

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText, selectedColor, progress)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Thêm ghi chú công việc</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Note Text Input */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Nội dung ghi chú
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
                    className="w-7 h-7 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center text-sm font-bold transition-all hover:scale-105"
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
              placeholder="Nhập nội dung công việc của bạn...&#10;• Sử dụng bullet points để tổ chức ý tưởng&#10;• Click vào Bullet Library ở trên để thêm ký hiệu"
              className="w-full p-4 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none leading-relaxed"
              rows={5}
              style={{ minHeight: '120px' }}
            />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Sử dụng bullet points để tổ chức nội dung</span>
              <span>{noteText.length} ký tự</span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 block">Chọn màu</label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`
                    w-full aspect-square rounded-lg transition-all transform hover:scale-110
                    ${color.bg}
                    ${selectedColor === color.id ? "ring-2 ring-offset-2 ring-slate-800 dark:ring-offset-slate-800 scale-110" : ""}
                  `}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tiến độ công việc</label>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>Bắt đầu</span>
              <span>50%</span>
              <span>Hoàn thành</span>
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
              onClick={handleAddNote}
              disabled={!noteText.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lưu ghi chú
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
