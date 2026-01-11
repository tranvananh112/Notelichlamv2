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
        relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ease-in-out
        ${completed
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
                }
        ${disabled || isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${completed ? 'focus:ring-green-500' : 'focus:ring-red-500'}
      `}
            title={completed ? "Nhiệm vụ đã hoàn thành - Click để đánh dấu chưa xong" : "Nhiệm vụ chưa hoàn thành - Click để đánh dấu đã xong"}
        >
            {/* Toggle Circle */}
            <span
                className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out
          ${completed ? 'translate-x-7' : 'translate-x-1'}
          ${isToggling ? 'scale-110' : 'scale-100'}
        `}
            >
                {/* Icon inside circle */}
                <span className="flex h-full w-full items-center justify-center">
                    {completed ? (
                        <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                </span>
            </span>

            {/* Status Text */}
            <span className={`
        absolute inset-0 flex items-center justify-center text-xs font-bold text-white
        ${completed ? 'pl-2' : 'pr-2'}
      `}>
                {completed ? 'XONG' : 'CHƯA'}
            </span>
        </button>
    )
}