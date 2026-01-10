"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    FileText,
    Briefcase,
    Calendar,
    CheckSquare,
    Target,
    BookOpen,
    Heart,
    Plane,
    DollarSign,
    Users,
    Lightbulb,
    Clock,
    Star,
    Plus
} from "lucide-react"

interface Template {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
    category: string
    content: string
    color: string
    priority: string
    tags: string[]
}

const TEMPLATES: Template[] = [
    {
        id: "meeting-notes",
        name: "Ghi chú cuộc họp",
        description: "Template cho việc ghi chú cuộc họp",
        icon: Users,
        category: "work",
        color: "blue",
        priority: "medium",
        tags: ["meeting", "work"],
        content: `
      <h3><strong>📅 Cuộc họp: [Tên cuộc họp]</strong></h3>
      <p><strong>🕐 Thời gian:</strong> [Ngày/Giờ]</p>
      <p><strong>👥 Người tham gia:</strong></p>
      <ul>
        <li>[Tên người 1]</li>
        <li>[Tên người 2]</li>
      </ul>
      
      <h4><strong>📋 Nội dung chính:</strong></h4>
      <ol>
        <li>[Điểm thảo luận 1]</li>
        <li>[Điểm thảo luận 2]</li>
      </ol>
      
      <h4><strong>✅ Quyết định:</strong></h4>
      <ul>
        <li>[ ] [Quyết định 1]</li>
        <li>[ ] [Quyết định 2]</li>
      </ul>
      
      <h4><strong>🎯 Hành động tiếp theo:</strong></h4>
      <ul>
        <li>[ ] [Nhiệm vụ 1] - <em>Người phụ trách: [Tên]</em></li>
        <li>[ ] [Nhiệm vụ 2] - <em>Deadline: [Ngày]</em></li>
      </ul>
    `
    },
    {
        id: "daily-plan",
        name: "Kế hoạch hàng ngày",
        description: "Lập kế hoạch cho một ngày làm việc",
        icon: Calendar,
        category: "personal",
        color: "green",
        priority: "high",
        tags: ["planning", "daily"],
        content: `
      <h3><strong>🌅 Kế hoạch ngày [Ngày/Tháng]</strong></h3>
      
      <h4><strong>🎯 Mục tiêu chính:</strong></h4>
      <ol>
        <li><mark>[Mục tiêu quan trọng nhất]</mark></li>
        <li>[Mục tiêu thứ 2]</li>
        <li>[Mục tiêu thứ 3]</li>
      </ol>
      
      <h4><strong>⏰ Lịch trình:</strong></h4>
      <ul>
        <li><strong>6:00 - 8:00:</strong> [Hoạt động sáng]</li>
        <li><strong>8:00 - 12:00:</strong> [Công việc buổi sáng]</li>
        <li><strong>12:00 - 13:00:</strong> 🍽️ Nghỉ trưa</li>
        <li><strong>13:00 - 17:00:</strong> [Công việc buổi chiều]</li>
        <li><strong>17:00 - 19:00:</strong> [Hoạt động tối]</li>
      </ul>
      
      <h4><strong>📝 Ghi chú:</strong></h4>
      <p>[Ghi chú quan trọng cho ngày hôm nay]</p>
    `
    },
    {
        id: "project-task",
        name: "Nhiệm vụ dự án",
        description: "Theo dõi tiến độ nhiệm vụ dự án",
        icon: Target,
        category: "work",
        color: "purple",
        priority: "high",
        tags: ["project", "task"],
        content: `
      <h3><strong>🚀 Dự án: [Tên dự án]</strong></h3>
      <p><strong>📋 Nhiệm vụ:</strong> [Tên nhiệm vụ]</p>
      <p><strong>⏱️ Deadline:</strong> <mark>[Ngày deadline]</mark></p>
      <p><strong>👤 Người phụ trách:</strong> [Tên người]</p>
      
      <h4><strong>📊 Tiến độ hiện tại:</strong></h4>
      <ul>
        <li>✅ [Công việc đã hoàn thành]</li>
        <li>🔄 [Công việc đang thực hiện]</li>
        <li>⏳ [Công việc chưa bắt đầu]</li>
      </ul>
      
      <h4><strong>🎯 Mục tiêu tuần này:</strong></h4>
      <ol>
        <li>[ ] [Mục tiêu 1]</li>
        <li>[ ] [Mục tiêu 2]</li>
        <li>[ ] [Mục tiêu 3]</li>
      </ol>
      
      <h4><strong>⚠️ Rủi ro & Vấn đề:</strong></h4>
      <p>[Ghi chú về các vấn đề cần chú ý]</p>
    `
    },
    {
        id: "study-notes",
        name: "Ghi chú học tập",
        description: "Template cho việc ghi chú bài học",
        icon: BookOpen,
        category: "study",
        color: "indigo",
        priority: "medium",
        tags: ["study", "learning"],
        content: `
      <h3><strong>📚 Môn học: [Tên môn]</strong></h3>
      <p><strong>📖 Chương/Bài:</strong> [Tên chương]</p>
      <p><strong>📅 Ngày học:</strong> [Ngày]</p>
      
      <h4><strong>🎯 Mục tiêu bài học:</strong></h4>
      <ul>
        <li>[Mục tiêu 1]</li>
        <li>[Mục tiêu 2]</li>
      </ul>
      
      <h4><strong>📝 Nội dung chính:</strong></h4>
      <ol>
        <li><strong>[Khái niệm 1]:</strong> [Định nghĩa và giải thích]</li>
        <li><strong>[Khái niệm 2]:</strong> [Định nghĩa và giải thích]</li>
      </ol>
      
      <h4><strong>💡 Ví dụ quan trọng:</strong></h4>
      <blockquote>
        <p>[Ví dụ minh họa]</p>
      </blockquote>
      
      <h4><strong>❓ Câu hỏi cần ôn tập:</strong></h4>
      <ul>
        <li>[ ] [Câu hỏi 1]</li>
        <li>[ ] [Câu hỏi 2]</li>
      </ul>
    `
    },
    {
        id: "health-tracker",
        name: "Theo dõi sức khỏe",
        description: "Ghi chú về tình trạng sức khỏe hàng ngày",
        icon: Heart,
        category: "health",
        color: "red",
        priority: "medium",
        tags: ["health", "wellness"],
        content: `
      <h3><strong>❤️ Theo dõi sức khỏe - [Ngày]</strong></h3>
      
      <h4><strong>💪 Tình trạng thể chất:</strong></h4>
      <ul>
        <li><strong>Cân nặng:</strong> [kg]</li>
        <li><strong>Giấc ngủ:</strong> [số giờ] - Chất lượng: [tốt/trung bình/kém]</li>
        <li><strong>Năng lượng:</strong> ⭐⭐⭐⭐⭐ ([1-5 sao])</li>
      </ul>
      
      <h4><strong>🏃‍♂️ Hoạt động thể chất:</strong></h4>
      <ul>
        <li>[ ] [Bài tập 1] - [thời gian]</li>
        <li>[ ] [Bài tập 2] - [thời gian]</li>
      </ul>
      
      <h4><strong>🥗 Dinh dưỡng:</strong></h4>
      <ul>
        <li><strong>Nước:</strong> [số ly] 💧</li>
        <li><strong>Bữa ăn:</strong> [mô tả ngắn gọn]</li>
      </ul>
      
      <h4><strong>🧠 Tâm trạng:</strong></h4>
      <p>[Mô tả cảm xúc và tâm trạng trong ngày]</p>
    `
    },
    {
        id: "travel-plan",
        name: "Kế hoạch du lịch",
        description: "Lập kế hoạch cho chuyến đi",
        icon: Plane,
        category: "travel",
        color: "cyan",
        priority: "medium",
        tags: ["travel", "planning"],
        content: `
      <h3><strong>✈️ Chuyến đi: [Tên địa điểm]</strong></h3>
      <p><strong>📅 Thời gian:</strong> [Ngày đi] - [Ngày về]</p>
      <p><strong>👥 Số người:</strong> [số người]</p>
      
      <h4><strong>🎒 Chuẩn bị:</strong></h4>
      <ul>
        <li>[ ] Đặt vé máy bay/xe</li>
        <li>[ ] Đặt khách sạn</li>
        <li>[ ] Chuẩn bị hành lý</li>
        <li>[ ] Kiểm tra giấy tờ</li>
      </ul>
      
      <h4><strong>📍 Lịch trình:</strong></h4>
      <p><strong>Ngày 1:</strong></p>
      <ul>
        <li>[Hoạt động sáng]</li>
        <li>[Hoạt động chiều]</li>
        <li>[Hoạt động tối]</li>
      </ul>
      
      <h4><strong>💰 Ngân sách:</strong></h4>
      <ul>
        <li><strong>Vé máy bay:</strong> [số tiền]</li>
        <li><strong>Khách sạn:</strong> [số tiền]</li>
        <li><strong>Ăn uống:</strong> [số tiền]</li>
        <li><strong>Tổng:</strong> <mark>[tổng số tiền]</mark></li>
      </ul>
    `
    }
]

interface NoteTemplatesProps {
    onSelectTemplate: (template: Template) => void
    onClose: () => void
}

export default function NoteTemplates({ onSelectTemplate, onClose }: NoteTemplatesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")

    const categories = [
        { id: "all", name: "Tất cả", icon: FileText },
        { id: "work", name: "Công việc", icon: Briefcase },
        { id: "personal", name: "Cá nhân", icon: Calendar },
        { id: "study", name: "Học tập", icon: BookOpen },
        { id: "health", name: "Sức khỏe", icon: Heart },
        { id: "travel", name: "Du lịch", icon: Plane },
    ]

    const filteredTemplates = TEMPLATES.filter(template => {
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesCategory && matchesSearch
    })

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <Card className="bg-white dark:bg-slate-800 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Template ghi chú</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Chọn template có sẵn để tạo ghi chú nhanh chóng
                            </p>
                        </div>
                        <Button onClick={onClose} variant="outline" size="sm">
                            Đóng
                        </Button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm template..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map(({ id, name, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setSelectedCategory(id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === id
                                        ? "bg-indigo-500 text-white shadow-md"
                                        : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">
                                Không tìm thấy template phù hợp
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredTemplates.map((template) => {
                                const Icon = template.icon
                                return (
                                    <Card
                                        key={template.id}
                                        className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-indigo-300 group"
                                        onClick={() => onSelectTemplate(template)}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-lg bg-${template.color}-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {template.name}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                    {template.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {template.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                            <span className="capitalize">{template.category}</span>
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3" />
                                                {template.priority}
                                            </span>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}