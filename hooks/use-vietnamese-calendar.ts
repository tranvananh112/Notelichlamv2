"use client"

import { useMemo } from 'react'

// Dữ liệu ngày lễ Việt Nam
const VIETNAMESE_HOLIDAYS = {
    // Ngày lễ cố định (dương lịch)
    '01-01': { name: 'Tết Dương lịch', type: 'holiday' },
    '02-14': { name: 'Lễ tình nhân', type: 'special' },
    '03-08': { name: 'Quốc tế Phụ nữ', type: 'holiday' },
    '04-30': { name: 'Giải phóng miền Nam', type: 'national' },
    '05-01': { name: 'Quốc tế Lao động', type: 'national' },
    '09-02': { name: 'Quốc khánh', type: 'national' },
    '10-20': { name: 'Ngày Phụ nữ Việt Nam', type: 'holiday' },
    '11-20': { name: 'Ngày Nhà giáo Việt Nam', type: 'holiday' },
    '12-25': { name: 'Giáng sinh', type: 'holiday' },

    // Ngày lễ âm lịch (sẽ được tính toán)
    'lunar-01-01': { name: 'Tết Nguyên đán', type: 'tet' },
    'lunar-01-15': { name: 'Rằm tháng Giêng', type: 'tet' },
    'lunar-03-10': { name: 'Giỗ Tổ Hùng Vương', type: 'national' },
    'lunar-04-15': { name: 'Phật đản', type: 'holiday' },
    'lunar-05-05': { name: 'Tết Đoan Ngọ', type: 'holiday' },
    'lunar-07-15': { name: 'Vu Lan', type: 'holiday' },
    'lunar-08-15': { name: 'Tết Trung thu', type: 'holiday' },
    'lunar-10-20': { name: 'Ngày Nhà giáo Việt Nam', type: 'holiday' },
    'lunar-12-23': { name: 'Ông Táo về trời', type: 'tet' },
}

// Can Chi
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

// Tên các tháng âm lịch
const LUNAR_MONTHS = [
    '', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu',
    'Bảy', 'Tám', 'Chín', 'Mười', 'Một', 'Chạp'
]

// Tên các ngày âm lịch
const LUNAR_DAYS = [
    '', 'Mồng 1', 'Mồng 2', 'Mồng 3', 'Mồng 4', 'Mồng 5', 'Mồng 6', 'Mồng 7', 'Mồng 8', 'Mồng 9', 'Mồng 10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
]

// Hàm tính toán ngày âm lịch (đơn giản hóa)
function solarToLunar(solarDate: Date) {
    // Đây là một thuật toán đơn giản hóa
    // Trong thực tế cần thuật toán chính xác hơn
    const year = solarDate.getFullYear()
    const month = solarDate.getMonth() + 1
    const day = solarDate.getDate()

    // Tính toán gần đúng (cần cải thiện)
    const lunarYear = year
    let lunarMonth = month - 1
    let lunarDay = day + 10

    if (lunarMonth <= 0) {
        lunarMonth = 12
    }
    if (lunarDay > 30) {
        lunarDay = lunarDay - 30
        lunarMonth++
    }
    if (lunarMonth > 12) {
        lunarMonth = 1
    }

    return {
        year: lunarYear,
        month: lunarMonth,
        day: lunarDay
    }
}

// Hàm lấy Can Chi
function getCanChi(date: Date) {
    const year = date.getFullYear()
    const canIndex = (year - 4) % 10
    const chiIndex = (year - 4) % 12
    return `${CAN[canIndex]} ${CHI[chiIndex]}`
}

export function useVietnameseCalendar() {
    const getDateInfo = useMemo(() => {
        return (date: Date) => {
            const lunar = solarToLunar(date)
            const canChi = getCanChi(date)

            // Kiểm tra ngày lễ dương lịch
            const solarKey = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            const solarHoliday = VIETNAMESE_HOLIDAYS[solarKey]

            // Kiểm tra ngày lễ âm lịch
            const lunarKey = `lunar-${String(lunar.month).padStart(2, '0')}-${String(lunar.day).padStart(2, '0')}`
            const lunarHoliday = VIETNAMESE_HOLIDAYS[lunarKey]

            const holiday = solarHoliday || lunarHoliday

            return {
                solar: {
                    day: date.getDate(),
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                },
                lunar: {
                    day: lunar.day,
                    month: lunar.month,
                    year: lunar.year,
                    dayName: LUNAR_DAYS[lunar.day] || lunar.day.toString(),
                    monthName: LUNAR_MONTHS[lunar.month] || lunar.month.toString()
                },
                canChi,
                holiday: holiday ? {
                    name: holiday.name,
                    type: holiday.type
                } : null,
                isWeekend: date.getDay() === 0 || date.getDay() === 6,
                isToday: new Date().toDateString() === date.toDateString()
            }
        }
    }, [])

    return { getDateInfo }
}