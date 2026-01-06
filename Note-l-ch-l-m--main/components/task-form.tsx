"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface TaskFormProps {
  selectedDate: string
  onSubmit: (task: {
    title: string
    description: string
    date: string
    category: "work" | "personal" | "meeting" | "deadline"
  }) => void
  onCancel: () => void
}

const categories = [
  { value: "work", label: "Công Việc", color: "from-blue-500 to-cyan-500" },
  { value: "personal", label: "Cá Nhân", color: "from-green-500 to-emerald-500" },
  { value: "meeting", label: "Cuộc Họp", color: "from-purple-500 to-pink-500" },
  { value: "deadline", label: "Hạn Chót", color: "from-orange-500 to-red-500" },
]

export default function TaskForm({ selectedDate, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"work" | "personal" | "meeting" | "deadline">("work")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({
        title,
        description,
        date: selectedDate,
        category,
      })
      setTitle("")
      setDescription("")
      setCategory("work")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">Thêm Công Việc</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề công việc..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm chi tiết công việc..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Danh Mục</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as any)}
                  className={`
                    p-3 rounded-lg font-semibold transition-all
                    ${
                      category === cat.value
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                        : "bg-gray-100 text-foreground hover:bg-gray-200"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground font-semibold hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
