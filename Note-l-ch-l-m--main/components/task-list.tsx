"use client"

import { CheckCircle2, Circle, Trash2, Edit2 } from "lucide-react"
import { useState } from "react"

interface Task {
  id: string
  title: string
  description: string
  date: string
  category: "work" | "personal" | "meeting" | "deadline"
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
}

const categoryConfig = {
  work: { label: "Công Việc", color: "from-blue-500 to-cyan-500", bg: "bg-blue-50", text: "text-blue-700" },
  personal: { label: "Cá Nhân", color: "from-green-500 to-emerald-500", bg: "bg-green-50", text: "text-green-700" },
  meeting: { label: "Cuộc Họp", color: "from-purple-500 to-pink-500", bg: "bg-purple-50", text: "text-purple-700" },
  deadline: { label: "Hạn Chót", color: "from-orange-500 to-red-500", bg: "bg-orange-50", text: "text-orange-700" },
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const handleEditStart = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const handleEditSave = (id: string) => {
    if (editTitle.trim()) {
      onUpdate(id, { title: editTitle })
      setEditingId(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-muted-foreground text-lg">Không có công việc nào hôm nay</p>
        <p className="text-muted-foreground">Thêm một công việc để bắt đầu</p>
      </div>
    )
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Danh Sách Công Việc ({completedCount}/{tasks.length})
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const config = categoryConfig[task.category]
            const isEditing = editingId === task.id

            return (
              <div
                key={task.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${task.completed ? "border-gray-200 bg-gray-50" : "border-transparent bg-gray-50 hover:bg-white"}
                `}
              >
                <div className="flex gap-4">
                  <button
                    onClick={() => onToggle(task.id)}
                    className="mt-1 text-primary hover:text-secondary transition flex-shrink-0"
                  >
                    {task.completed ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleEditSave(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(task.id)
                          if (e.key === "Escape") setEditingId(null)
                        }}
                        className="w-full px-2 py-1 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-lg ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p
                                className={`text-sm mt-1 ${task.completed ? "text-muted-foreground" : "text-muted-foreground"}`}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`${config.bg} ${config.text} text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap mt-1`}
                          >
                            {config.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!isEditing && (
                      <>
                        <button
                          onClick={() => handleEditStart(task)}
                          className="text-muted-foreground hover:text-primary transition p-1"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(task.id)}
                          className="text-muted-foreground hover:text-destructive transition p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
