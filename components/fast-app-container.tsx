"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useFastLoading } from "@/hooks/use-fast-loading"
import dynamic from "next/dynamic"

// Lazy load heavy components with better loading states
const CalendarView = dynamic(() => import("./calendar-view"), {
    loading: () => (
        <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg h-96 flex items-center justify-center">
            <div className="text-slate-500 dark:text-slate-400">Đang tải lịch...</div>
        </div>
    ),
    ssr: false
})

const NotePanel = dynamic(() => import("./note-panel"), {
    loading: () => (
        <div className="animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg h-full flex items-center justify-center">
            <div className="text-slate-500 dark:text-slate-400">Đang tải ghi chú...</div>
        </div>
    ),
    ssr: false
})

const ReportsModal = dynamic(() => import("./reports-modal"), { ssr: false })
const PayrollModal = dynamic(() => import("./payroll-modal"), { ssr: false })
const AdminDashboard = dynamic(() => import("./admin-dashboard"), { ssr: false })

import Header from "./header"
import ReportsButton from "./reports-button"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { LogOut, Settings, RefreshCw } from "lucide-react"

interface User {
    id: string
    email: string
}

interface FastAppContainerProps {
    user: User
    isAdmin: boolean
}

export default function FastAppContainer({ user, isAdmin }: FastAppContainerProps) {
    const router = useRouter()
    const supabase = createClient()

    // Fast loading hook
    const { isLoading, data, error, refresh, clearCache } = useFastLoading({
        userId: user.id,
        onError: (error) => console.error('Fast loading failed:', error),
        onSuccess: () => console.log('Data loaded successfully')
    })

    // Local state
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [currentTime, setCurrentTime] = useState<Date>(new Date())
    const [showPayrollModal, setShowPayrollModal] = useState(false)
    const [showReportsModal, setShowReportsModal] = useState(false)
    const [showAdminDashboard, setShowAdminDashboard] = useState(false)
    const [showNotePanel, setShowNotePanel] = useState(false)

    // Memoized data processing
    const processedData = useMemo(() => {
        if (!data) return {
            notes: {},
            allFutureTasks: {},
            futureTasks: [],
            payrollHistory: [],
            workStartDate: null,
            daysWorked: 0
        }

        const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""

        return {
            notes: data.notes,
            allFutureTasks: data.futureTasks,
            futureTasks: dateKey ? (data.futureTasks[dateKey] || []) : [],
            payrollHistory: data.payrollHistory,
            workStartDate: data.workData?.start_date ? new Date(data.workData.start_date) : null,
            daysWorked: data.workData?.days_worked || 0
        }
    }, [data, selectedDate])

    // Update current time every second (optimized)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Optimized handlers
    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date)
        setShowNotePanel(true)
    }, [])

    const handleLogout = useCallback(async () => {
        clearCache() // Clear cache on logout
        await supabase.auth.signOut()
        router.push("/auth/login")
    }, [supabase, router, clearCache])

    const handleRefresh = useCallback(async () => {
        await refresh()
    }, [refresh])

    // Optimized note operations
    const addNote = useCallback(async (text: string, type: "note" | "attendance" = "note", color = "blue", progress?: number) => {
        if (!selectedDate) return

        const now = new Date()
        const timestamp = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
        const dateKey = selectedDate.toISOString().split("T")[0]

        try {
            const { data: insertData, error } = await supabase.from("notes").insert({
                user_id: user.id,
                date: dateKey,
                text,
                type,
                color: type === "attendance" ? "green" : color,
                progress: progress || 0,
                completed: false,
                created_at: now.toISOString(),
                timestamp: timestamp,
            }).select().single()

            if (error) throw error

            // Optimistically update local state
            const newNote = {
                id: insertData.id,
                text,
                timestamp,
                type,
                color: type === "attendance" ? "green" : color,
                progress,
                completed: false,
            }

            // Update cache immediately
            if (data) {
                const updatedNotes = { ...data.notes }
                if (!updatedNotes[dateKey]) updatedNotes[dateKey] = []
                updatedNotes[dateKey] = [...updatedNotes[dateKey], newNote]

                // Update cache
                localStorage.setItem(`app_data_cache_${user.id}`, JSON.stringify({
                    ...data,
                    notes: updatedNotes,
                    lastUpdated: Date.now()
                }))
            }

            // Refresh data to ensure consistency
            refresh()
        } catch (error) {
            console.error("Error adding note:", error)
        }
    }, [selectedDate, supabase, user.id, data, refresh])

    const deleteNote = useCallback(async (noteId: string) => {
        try {
            const { error } = await supabase.from("notes").delete().eq("id", noteId)
            if (error) throw error

            // Refresh data
            refresh()
        } catch (error) {
            console.error("Error deleting note:", error)
        }
    }, [supabase, refresh])

    const updateNote = useCallback(async (
        noteId: string,
        updates: Partial<{ text: string; color: string; progress: number; completed: boolean; status: string }>
    ) => {
        try {
            const { error } = await supabase.from("notes").update(updates).eq("id", noteId)
            if (error) throw error

            // Refresh data
            refresh()
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }, [supabase, refresh])

    // Future task operations (optimized)
    const addFutureTask = useCallback(async (text: string, color = "blue", priority = "medium") => {
        if (!selectedDate) return

        const dateKey = selectedDate.toISOString().split("T")[0]

        try {
            const { error } = await supabase.from("future_tasks").insert({
                user_id: user.id,
                date: dateKey,
                text,
                color,
                priority,
                status: "planning",
                completed: false
            })

            if (error) throw error
            refresh()
        } catch (error) {
            console.error("Error adding future task:", error)
        }
    }, [selectedDate, supabase, user.id, refresh])

    const deleteFutureTask = useCallback(async (taskId: string) => {
        try {
            const { error } = await supabase.from("future_tasks").delete().eq("id", taskId)
            if (error) throw error
            refresh()
        } catch (error) {
            console.error("Error deleting future task:", error)
        }
    }, [supabase, refresh])

    const updateFutureTask = useCallback(async (
        taskId: string,
        updates: Partial<{ text: string; color: string; priority: string; status: string; completed: boolean }>
    ) => {
        try {
            const { error } = await supabase.from("future_tasks").update(updates).eq("id", taskId)
            if (error) throw error
            refresh()
        } catch (error) {
            console.error("Error updating future task:", error)
        }
    }, [supabase, refresh])

    // Optimized helper functions
    const getNoteCount = useCallback((date: Date): number => {
        const key = date.toISOString().split("T")[0]
        return processedData.notes[key]?.length || 0
    }, [processedData.notes])

    const getIncompleteNoteCount = useCallback((date: Date): number => {
        const key = date.toISOString().split("T")[0]
        const dayNotes = processedData.notes[key] || []
        return dayNotes.filter(note => note.type === "note" && !note.completed).length
    }, [processedData.notes])

    const getFutureTasksCount = useCallback((date: Date): number => {
        const key = date.toISOString().split("T")[0]
        const tasks = processedData.allFutureTasks[key] || []
        return tasks.filter(task => !task.completed).length
    }, [processedData.allFutureTasks])

    const getHasAttendance = useCallback((date: Date): boolean => {
        const key = date.toISOString().split("T")[0]
        return processedData.notes[key]?.some((note) => note.type === "attendance") || false
    }, [processedData.notes])

    const getAttendanceInfo = useCallback((date: Date): { type: string; icon: string } | null => {
        const key = date.toISOString().split("T")[0]
        const attendanceNote = processedData.notes[key]?.find((note) => note.type === "attendance")

        if (!attendanceNote) return null

        if (attendanceNote.text.includes("Cả ngày")) {
            return { type: "full", icon: "🌞" }
        } else if (attendanceNote.text.includes("Buổi sáng")) {
            return { type: "morning", icon: "🌅" }
        } else if (attendanceNote.text.includes("Buổi chiều")) {
            return { type: "afternoon", icon: "🌆" }
        }

        return { type: "full", icon: "✓" }
    }, [processedData.notes])

    // Loading state
    if (isLoading && !data) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Đang tải dữ liệu...</p>
                </div>
            </main>
        )
    }

    // Error state
    if (error && !data) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 mb-4">Lỗi tải dữ liệu: {error}</p>
                    <Button onClick={handleRefresh} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Thử lại
                    </Button>
                </div>
            </main>
        )
    }

    const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
    const dayNotes = dateKey ? (processedData.notes[dateKey] || []) : []

    if (showAdminDashboard && isAdmin) {
        return <AdminDashboard onBack={() => setShowAdminDashboard(false)} currentUserEmail={user.email} />
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
            <Header currentTime={currentTime} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Xin chào, {user.email}</h1>
                        {isAdmin && <p className="text-sm text-purple-600 dark:text-purple-400">Quản Trị Viên</p>}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs text-blue-600 dark:text-blue-400">Đang đồng bộ...</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleRefresh} className="gap-2" disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        {isAdmin && (
                            <Button variant="outline" onClick={() => setShowAdminDashboard(true)} className="gap-2">
                                <Settings className="w-4 h-4" />
                                Quản Lí Tài Khoản
                            </Button>
                        )}
                        <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                            <LogOut className="w-4 h-4" />
                            Đăng Xuất
                        </Button>
                    </div>
                </div>

                {/* Calendar */}
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    <Suspense fallback={
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-96" />
                    }>
                        <CalendarView
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            getNoteCount={getNoteCount}
                            getHasAttendance={getHasAttendance}
                            getAttendanceInfo={getAttendanceInfo}
                            getFutureTasksCount={getFutureTasksCount}
                            getIncompleteNoteCount={getIncompleteNoteCount}
                        />
                    </Suspense>
                </Card>

                {/* Reports Button */}
                <div className="flex justify-end mt-6">
                    <ReportsButton onClick={() => setShowReportsModal(true)} />
                </div>
            </div>

            {/* Note Panel */}
            {showNotePanel && selectedDate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-800 shadow-2xl overflow-hidden flex flex-col">
                        <Suspense fallback={
                            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-full" />
                        }>
                            <NotePanel
                                selectedDate={selectedDate}
                                dayNotes={dayNotes}
                                onAddNote={addNote}
                                onDeleteNote={deleteNote}
                                onUpdateNote={updateNote}
                                hasWorkStarted={processedData.workStartDate !== null}
                                onClose={() => setShowNotePanel(false)}
                                futureTasks={processedData.futureTasks}
                                onAddFutureTask={addFutureTask}
                                onDeleteFutureTask={deleteFutureTask}
                                onUpdateFutureTask={updateFutureTask}
                            />
                        </Suspense>
                    </Card>
                </div>
            )}

            {/* Modals */}
            <ReportsModal
                daysWorked={processedData.daysWorked}
                workStartDate={processedData.workStartDate}
                payrollHistory={processedData.payrollHistory}
                notes={processedData.notes}
                isOpen={showReportsModal}
                onClose={() => setShowReportsModal(false)}
            />

            {showPayrollModal && (
                <PayrollModal
                    daysWorked={processedData.daysWorked}
                    onConfirm={async (amount: number) => {
                        const today = new Date().toISOString().split("T")[0]
                        await supabase.from("payroll_history").insert({
                            user_id: user.id,
                            amount,
                            paid_date: today,
                        })
                        setShowPayrollModal(false)
                        refresh()
                    }}
                    onClose={() => setShowPayrollModal(false)}
                />
            )}
        </main>
    )
}