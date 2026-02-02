"use client"

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVietnameseCalendar } from '@/hooks/use-vietnamese-calendar'

interface VietnameseCalendarProps {
    onDateSelect?: (date: Date) => void
    selectedDate?: Date | null
}

export default function VietnameseCalendar({ onDateSelect, selectedDate }: VietnameseCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const { getDateInfo } = useVietnameseCalendar()

    const { daysInMonth, firstDayOfMonth } = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDayOfMonth = new Date(year, month, 1).getDay()

        return { daysInMonth, firstDayOfMonth }
    }, [currentMonth])

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ]

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    }

    const getHolidayColor = (type: string) => {
        switch (type) {
            case 'tet': return 'text-red-600 bg-red-50'
            case 'national': return 'text-blue-600 bg-blue-50'
            case 'holiday': return 'text-green-600 bg-green-50'
            case 'special': return 'text-pink-600 bg-pink-50'
            default: return 'text-gray-600 bg-gray-50'
        }
    }

    return (
        <div
            className="p-6 relative min-h-screen"
            style={{
                backgroundImage: "url('/banner anh2026.svg')",
                backgroundSize: 'contain',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#f8fafc'
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={previousMonth}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
                            Hôm Nay
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'].map((day) => (
                        <div key={day} className="text-center font-semibold text-sm text-slate-800 py-3 bg-white/60 rounded-lg shadow-sm border border-gray-200/70">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: (firstDayOfMonth + 6) % 7 }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-32" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1
                        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                        const dateInfo = getDateInfo(currentDate)
                        const isSelected = selectedDate?.toDateString() === currentDate.toDateString()

                        return (
                            <button
                                key={day}
                                onClick={() => onDateSelect?.(currentDate)}
                                className={`
                  h-32 p-2 rounded-lg border transition-all duration-200 hover:shadow-lg
                  ${isSelected
                                        ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white border-red-300 shadow-lg'
                                        : dateInfo.isToday
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-yellow-300 shadow-md'
                                            : dateInfo.isWeekend
                                                ? 'bg-red-50/60 border-red-300/70 hover:bg-red-100/70 shadow-sm'
                                                : 'bg-white/70 border-gray-300/70 hover:bg-white/80 shadow-sm'
                                    }
                `}
                            >
                                {/* Solar date */}
                                <div className={`text-lg font-bold ${isSelected || dateInfo.isToday ? 'text-white' :
                                    dateInfo.isWeekend ? 'text-red-600' : 'text-gray-900'
                                    }`}>
                                    {day}
                                </div>

                                {/* Lunar date */}
                                <div className={`text-xs ${isSelected || dateInfo.isToday ? 'text-white/90' : 'text-gray-600'
                                    }`}>
                                    {dateInfo.lunar.dayName}
                                </div>

                                {/* Can Chi (for special days) */}
                                {(dateInfo.lunar.day === 1 || dateInfo.holiday) && (
                                    <div className={`text-xs font-medium ${isSelected || dateInfo.isToday ? 'text-white/80' : 'text-gray-500'
                                        }`}>
                                        {dateInfo.lunar.day === 1 ? dateInfo.lunar.monthName : ''}
                                    </div>
                                )}

                                {/* Holiday */}
                                {dateInfo.holiday && (
                                    <div className={`text-xs font-bold mt-1 px-1 py-0.5 rounded ${isSelected || dateInfo.isToday
                                        ? 'bg-white/20 text-white'
                                        : getHolidayColor(dateInfo.holiday.type)
                                        }`}>
                                        {dateInfo.holiday.name}
                                    </div>
                                )}

                                {/* Can Chi year indicator */}
                                {day === 1 && (
                                    <div className={`text-xs mt-1 ${isSelected || dateInfo.isToday ? 'text-white/70' : 'text-gray-500'
                                        }`}>
                                        {dateInfo.canChi}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-8 p-4 bg-white/70 rounded-lg shadow-md border border-gray-200/70">
                    <h3 className="font-semibold text-gray-800 mb-3">Chú thích:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                            <span>Tết, Lễ lớn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                            <span>Ngày Quốc gia</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                            <span>Ngày Lễ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-pink-50 border border-pink-200 rounded"></div>
                            <span>Ngày đặc biệt</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}