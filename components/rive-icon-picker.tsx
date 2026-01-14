"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Smile } from "lucide-react"
import RiveIcon from "./rive-icon"

interface RiveIconPickerProps {
    onSelectIcon: (iconData: string) => void
    onClose: () => void
}

// Danh sách các icon có sẵn trong file Rive
const RIVE_ICONS = [
    { id: "home", name: "Nhà", artboard: "Home" },
    { id: "work", name: "Công việc", artboard: "Work" },
    { id: "heart", name: "Yêu thích", artboard: "Heart" },
    { id: "star", name: "Ngôi sao", artboard: "Star" },
    { id: "bell", name: "Thông báo", artboard: "Bell" },
    { id: "mail", name: "Thư", artboard: "Mail" },
    { id: "user", name: "Người dùng", artboard: "User" },
    { id: "settings", name: "Cài đặt", artboard: "Settings" },
    { id: "calendar", name: "Lịch", artboard: "Calendar" },
    { id: "clock", name: "Đồng hồ", artboard: "Clock" },
    { id: "camera", name: "Máy ảnh", artboard: "Camera" },
    { id: "music", name: "Âm nhạc", artboard: "Music" },
    { id: "video", name: "Video", artboard: "Video" },
    { id: "phone", name: "Điện thoại", artboard: "Phone" },
    { id: "message", name: "Tin nhắn", artboard: "Message" },
    { id: "location", name: "Vị trí", artboard: "Location" },
    { id: "search", name: "Tìm kiếm", artboard: "Search" },
    { id: "plus", name: "Thêm", artboard: "Plus" },
    { id: "check", name: "Hoàn thành", artboard: "Check" },
    { id: "close", name: "Đóng", artboard: "Close" },
]

export default function RiveIconPicker({ onSelectIcon, onClose }: RiveIconPickerProps) {
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

    const handleSelectIcon = (icon: typeof RIVE_ICONS[0]) => {
        const iconHtml = `<span class="rive-icon" data-src="/animations/25691-47977-interactive-icon-set.riv" data-artboard="${icon.artboard}" style="display: inline-block; width: 24px; height: 24px; vertical-align: middle; margin: 0 4px;">[${icon.name}]</span>`
        onSelectIcon(iconHtml)
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                <Smile className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Chọn Icon</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Thêm icon động vào ghi chú của bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Icon Grid */}
                    <div className="max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-4">
                            {RIVE_ICONS.map((icon) => (
                                <button
                                    key={icon.id}
                                    onClick={() => handleSelectIcon(icon)}
                                    className={`
                    group relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex flex-col items-center gap-2
                    ${selectedIcon === icon.id
                                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg"
                                            : "border-slate-200 dark:border-slate-600 hover:border-purple-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                        }
                  `}
                                >
                                    {/* Rive Icon */}
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <RiveIcon
                                            src="/animations/25691-47977-interactive-icon-set.riv"
                                            width={32}
                                            height={32}
                                            className="transition-transform group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Icon Name */}
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">
                                        {icon.name}
                                    </span>

                                    {/* Selection Indicator */}
                                    {selectedIcon === icon.id && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Cách sử dụng:</h4>
                                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                    <li>• Click vào icon để chèn vào ghi chú</li>
                                    <li>• Icon sẽ có animation khi hover và click</li>
                                    <li>• Có thể chèn nhiều icon trong một ghi chú</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}