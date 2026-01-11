"use client"

import { useState } from "react"

interface TaskToggleSwitchProps {
    completed: boolean
    onChange: (completed: boolean) => void
    disabled?: boolean
}

export default function TaskToggleSwitch({ completed, onChange, disabled = false }: TaskToggleSwitchProps) {
    const [isToggling, setIsToggling] = useState(false)

    const handleToggle = async () => {
        if (disabled || isToggling) return

        setIsToggling(true)
        try {
            onChange(!completed)
        } finally {
            setTimeout(() => setIsToggling(false), 200) // Prevent rapid clicking
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={disabled || isToggling}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out group
                ${completed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md shadow-green-500/20'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-md shadow-red-500/20'
                }
                ${disabled || isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-offset-1 
                ${completed ? 'focus:ring-green-500' : 'focus:ring-red-500'}
            `}
            title={completed ? "Đã hoàn thành - Click để đánh dấu chưa xong" : "Chưa hoàn thành - Click để đánh dấu đã xong"}
        >
            {/* Toggle Circle */}
            <span
                className={`
                    inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out
                    ${completed ? 'translate-x-6' : 'translate-x-1'}
                    ${isToggling ? 'scale-110' : 'scale-100'}
                `}
            >
                {/* Icon inside circle */}
                <span className="flex h-full w-full items-center justify-center">
                    {completed ? (
                        <svg className="h-2.5 w-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="h-2.5 w-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </span>
            </span>

            {/* Compact Status Text - Only show on hover */}
            <span className={`
                absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity
                ${completed ? 'pl-1' : 'pr-1'}
            `}>
                {completed ? 'OK' : 'NO'}
            </span>
        </button>
    )
}