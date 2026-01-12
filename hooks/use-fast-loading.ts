"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface FastLoadingOptions {
    userId: string
    onError?: (error: any) => void
    onSuccess?: () => void
}

interface CacheData {
    notes: Record<string, any[]>
    futureTasks: Record<string, any[]>
    payrollHistory: any[]
    workData: any
    lastUpdated: number
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const CACHE_KEY = "app_data_cache"

export function useFastLoading({ userId, onError, onSuccess }: FastLoadingOptions) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<CacheData | null>(null)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    // Get cached data
    const getCachedData = useCallback((): CacheData | null => {
        try {
            const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`)
            if (!cached) return null

            const parsedData = JSON.parse(cached)
            const now = Date.now()

            // Check if cache is still valid
            if (now - parsedData.lastUpdated < CACHE_DURATION) {
                return parsedData
            }

            // Cache expired
            localStorage.removeItem(`${CACHE_KEY}_${userId}`)
            return null
        } catch (error) {
            console.error("Error reading cache:", error)
            return null
        }
    }, [userId])

    // Set cached data
    const setCachedData = useCallback((newData: Omit<CacheData, 'lastUpdated'>) => {
        try {
            const cacheData: CacheData = {
                ...newData,
                lastUpdated: Date.now()
            }
            localStorage.setItem(`${CACHE_KEY}_${userId}`, JSON.stringify(cacheData))
        } catch (error) {
            console.error("Error setting cache:", error)
        }
    }, [userId])

    // Load data with caching
    const loadData = useCallback(async (forceRefresh = false) => {
        setIsLoading(true)
        setError(null)

        try {
            // Try cache first (unless force refresh)
            if (!forceRefresh) {
                const cachedData = getCachedData()
                if (cachedData) {
                    setData(cachedData)
                    setIsLoading(false)
                    onSuccess?.()
                    return cachedData
                }
            }

            // Load from database with parallel requests
            const [notesResult, futureTasksResult, payrollResult, workResult] = await Promise.allSettled([
                supabase
                    .from("notes")
                    .select("id, text, timestamp, created_at, type, color, progress, completed, status, date")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: true }),

                supabase
                    .from("future_tasks")
                    .select("id, text, color, priority, status, completed, created_at, date")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: true }),

                supabase
                    .from("payroll_history")
                    .select("paid_date, amount")
                    .eq("user_id", userId),

                supabase
                    .from("work_tracking")
                    .select("start_date, days_worked")
                    .eq("user_id", userId)
                    .single()
            ])

            // Process results
            const notes: Record<string, any[]> = {}
            const futureTasks: Record<string, any[]> = {}
            let payrollHistory: any[] = []
            let workData: any = null

            // Process notes
            if (notesResult.status === 'fulfilled' && notesResult.value.data) {
                const notesWithDate = notesResult.value.data.filter((note: any) => note.date !== null)

                notesWithDate.forEach((note: any) => {
                    const dateKey = note.date
                    if (!notes[dateKey]) notes[dateKey] = []

                    notes[dateKey].push({
                        id: note.id,
                        text: note.text,
                        timestamp: note.timestamp || new Date(note.created_at).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        type: note.type,
                        color: note.color,
                        progress: note.progress,
                        completed: note.completed,
                        status: note.status,
                    })
                })
            }

            // Process future tasks
            if (futureTasksResult.status === 'fulfilled' && futureTasksResult.value.data) {
                futureTasksResult.value.data.forEach((task: any) => {
                    const dateKey = task.date
                    if (!futureTasks[dateKey]) futureTasks[dateKey] = []

                    futureTasks[dateKey].push({
                        id: task.id,
                        text: task.text,
                        color: task.color,
                        priority: task.priority,
                        status: task.status,
                        completed: task.completed || false,
                        created_at: task.created_at
                    })
                })
            }

            // Process payroll
            if (payrollResult.status === 'fulfilled' && payrollResult.value.data) {
                payrollHistory = payrollResult.value.data.map((p: any) => ({
                    date: p.paid_date,
                    amount: p.amount
                }))
            }

            // Process work data
            if (workResult.status === 'fulfilled' && workResult.value.data) {
                workData = workResult.value.data
            }

            const newData = {
                notes,
                futureTasks,
                payrollHistory,
                workData
            }

            // Cache the data
            setCachedData(newData)

            const finalData: CacheData = {
                ...newData,
                lastUpdated: Date.now()
            }

            setData(finalData)
            onSuccess?.()

            return finalData

        } catch (error) {
            console.error("Error loading data:", error)
            setError(error instanceof Error ? error.message : "Unknown error")
            onError?.(error)

            // Try to use stale cache as fallback
            const staleCache = getCachedData()
            if (staleCache) {
                setData(staleCache)
            }

            return null
        } finally {
            setIsLoading(false)
        }
    }, [userId, supabase, getCachedData, setCachedData, onError, onSuccess])

    // Initial load
    useEffect(() => {
        loadData()
    }, [loadData])

    // Refresh function
    const refresh = useCallback(() => {
        return loadData(true)
    }, [loadData])

    // Clear cache
    const clearCache = useCallback(() => {
        localStorage.removeItem(`${CACHE_KEY}_${userId}`)
    }, [userId])

    return {
        isLoading,
        data,
        error,
        refresh,
        clearCache
    }
}