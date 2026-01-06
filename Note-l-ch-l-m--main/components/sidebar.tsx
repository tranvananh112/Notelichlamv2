"use client"

import type { Category } from "@/app/page"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface SidebarProps {
  categories: Category[]
  onToggleCategory: (id: string) => void
}

export default function Sidebar({ categories, onToggleCategory }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Danh Mục</h3>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-3 h-3 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                  <input
                    type="checkbox"
                    id={`cat-${category.id}`}
                    checked={category.checked}
                    onChange={() => onToggleCategory(category.id)}
                    className="w-4 h-4 rounded cursor-pointer accent-blue-500"
                  />
                  <Label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                  >
                    {category.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Thống Kê</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Công việc hôm nay</span>
              <span className="text-sm font-bold text-gray-900">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hoàn thành</span>
              <span className="text-sm font-bold text-green-600">0</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
