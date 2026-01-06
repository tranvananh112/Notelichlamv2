"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import type { Task } from "@/app/page"

interface AddTaskModalProps {
  isOpen: boolean
  selectedDate: string
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void
  onClose: () => void
}

const CATEGORIES = [
  { id: "work", name: "Công Việc", color: "#3B82F6" },
  { id: "personal", name: "Cá Nhân", color: "#10B981" },
  { id: "meeting", name: "Cuộc Họp", color: "#F59E0B" },
  { id: "important", name: "Quan Trọng", color: "#EF4444" },
  { id: "health", name: "Sức Khỏe", color: "#8B5CF6" },
  { id: "learning", name: "Học Tập", color: "#06B6D4" },
]

export default function AddTaskModal({ isOpen, selectedDate, onSubmit, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [completion, setCompletion] = useState(0)
  const [category, setCategory] = useState<"work" | "personal" | "meeting" | "important" | "health" | "learning">(
    "work",
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const selectedCategory = CATEGORIES.find((c) => c.id === category)

    onSubmit({
      title,
      description,
      startDate: selectedDate,
      endDate: selectedDate,
      startTime,
      endTime,
      category: category as any,
      completed: false,
      completion,
      color: selectedCategory?.color || "#3B82F6",
    })

    setTitle("")
    setDescription("")
    setStartTime("09:00")
    setEndTime("10:00")
    setCompletion(0)
    setCategory("work")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground">Thêm Công Việc Mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-input rounded-lg transition-colors">
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tiêu Đề *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề công việc..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-input"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Mô Tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm chi tiết về công việc..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-input resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Ngày</label>
            <input
              type="date"
              value={selectedDate}
              disabled
              className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground cursor-not-allowed opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Giờ Bắt Đầu</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Giờ Kết Thúc</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground bg-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Tiến Độ Ban Đầu (%)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={completion}
                onChange={(e) => setCompletion(Number.parseInt(e.target.value))}
                className="flex-1 h-2 bg-input rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-semibold text-foreground min-w-12 text-right">{completion}%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Danh Mục</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as any)}
                  className={`p-3 rounded-lg font-medium transition-all text-white border-2 ${
                    category === cat.id ? "border-current shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: cat.color,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground font-semibold hover:bg-input transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Thêm Công Việc
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
