"use client"

import type { Task, Category } from "@/app/page"
import { X, Edit2, Trash2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface TaskDetailsPanelProps {
  task: Task
  categories: Category[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export default function TaskDetailsPanel({ task, categories, onUpdate, onDelete, onClose }: TaskDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const category = categories.find((c) => c.id === task.category)

  const handleSave = () => {
    onUpdate(task.id, editedTask)
    setIsEditing(false)
  }

  return (
    <div className="w-96 bg-card border-l border-border overflow-y-auto flex flex-col shadow-xl">
      <div
        className="p-6 border-b border-border flex items-center justify-between text-white"
        style={{ backgroundColor: task.color }}
      >
        <h3 className="text-lg font-bold">Chi Tiết Công Việc</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">Tiêu Đề</label>
          {isEditing ? (
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p className="text-lg font-bold text-foreground">{task.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">
            Danh Mục
          </label>
          <div
            className="px-3 py-2 rounded-lg text-white font-medium inline-block"
            style={{ backgroundColor: category?.color || "#6B7280" }}
          >
            {category?.name}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            Tiến Độ Hoàn Thành
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-full mr-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editedTask.completion}
                  onChange={(e) => setEditedTask({ ...editedTask, completion: Number.parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${editedTask.completion}%, var(--input) ${editedTask.completion}%, var(--input) 100%)`,
                  }}
                />
              </div>
              <div className="text-sm font-bold text-foreground min-w-12 text-right">{editedTask.completion}%</div>
            </div>
            <div className="w-full bg-input rounded-full h-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${editedTask.completion}%`,
                  backgroundColor: task.color,
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">
            Ngày Bắt Đầu
          </label>
          {isEditing ? (
            <input
              type="date"
              value={editedTask.startDate}
              onChange={(e) => setEditedTask({ ...editedTask, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <p className="text-foreground/80">
              {new Date(task.startDate).toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">
              Giờ Bắt Đầu
            </label>
            {isEditing ? (
              <input
                type="time"
                value={editedTask.startTime}
                onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-foreground/80 font-mono">{task.startTime}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">
              Giờ Kết Thúc
            </label>
            {isEditing ? (
              <input
                type="time"
                value={editedTask.endTime}
                onChange={(e) => setEditedTask({ ...editedTask, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <p className="text-foreground/80 font-mono">{task.endTime}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground/60 uppercase mb-2 tracking-wide">Mô Tả</label>
          {isEditing ? (
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          ) : (
            <p className="text-foreground/80 whitespace-pre-wrap">{task.description || "Không có mô tả"}</p>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-input">
          <input
            type="checkbox"
            id="completed"
            checked={editedTask.completed}
            onChange={(e) => setEditedTask({ ...editedTask, completed: e.target.checked })}
            disabled={!isEditing}
            className="w-5 h-5 rounded cursor-pointer accent-primary"
          />
          <label htmlFor="completed" className="text-sm font-medium text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Hoàn thành
          </label>
        </div>
      </div>

      <div className="p-6 border-t border-border flex gap-2">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh Sửa
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium"
            >
              Lưu
            </button>
            <button
              onClick={() => {
                setEditedTask(task)
                setIsEditing(false)
              }}
              className="flex-1 px-4 py-2 bg-input text-foreground rounded-lg hover:bg-input/80 transition-colors font-medium"
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  )
}
