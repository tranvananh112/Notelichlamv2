import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CacheEntry<T> {
    data: T
    timestamp: number
    expiry: number
}

class DataCache {
    private cache = new Map<string, CacheEntry<any>>()
    private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

    set<T>(key: string, data: T, ttl = this.DEFAULT_TTL) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + ttl
        })
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return null
        }

        return entry.data
    }

    invalidate(pattern?: string) {
        if (!pattern) {
            this.cache.clear()
            return
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key)
            }
        }
    }

    has(key: string): boolean {
        const entry = this.cache.get(key)
        return entry ? Date.now() <= entry.expiry : false
    }
}

const globalCache = new DataCache()

export function useOptimizedData(userId: string) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    // Optimized notes loader with caching
    const loadNotes = useCallback(async (forceRefresh = false) => {
        const cacheKey = `notes_${userId}`

        if (!forceRefresh && globalCache.has(cacheKey)) {
            return globalCache.get(cacheKey)
        }

        setLoading(true)
        setError(null)

        try {
            const { data, error: dbError } = await supabase
                .from("notes")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            if (dbError) throw dbError

            const processedNotes = data?.filter(note => note.date !== null).reduce(
                (acc, note) => {
                    const dateKey = note.date
                    if (!acc[dateKey]) acc[dateKey] = []
                    acc[dateKey].push({
                        id: note.id,
                        text: note.text,
                        timestamp: note.timestamp ||
                            new Date(note.created_at).toLocaleTimeString("vi-VN", {
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
                    return acc
                },
                {} as Record<string, any[]>
            ) || {}

            globalCache.set(cacheKey, processedNotes)
            return processedNotes
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            return {}
        } finally {
            setLoading(false)
        }
    }, [userId, supabase])

    // Optimized future tasks loader
    const loadFutureTasks = useCallback(async (date: string, forceRefresh = false) => {
        const cacheKey = `future_tasks_${userId}_${date}`

        if (!forceRefresh && globalCache.has(cacheKey)) {
            return globalCache.get(cacheKey)
        }

        try {
            const { data, error: dbError } = await supabase
                .from("future_tasks")
                .select("*")
                .eq("user_id", userId)
                .eq("date", date)
                .order("created_at", { ascending: true })

            if (dbError) {
                // Fallback to localStorage
                const storageKey = `futureTasks_${userId}_${date}`
                const saved = localStorage.getItem(storageKey)
                return saved ? JSON.parse(saved) : []
            }

            const tasks = data?.map(task => ({
                id: task.id,
                text: task.text,
                color: task.color,
                priority: task.priority,
                status: task.status,
                created_at: task.created_at,
                tags: task.tags || []
            })) || []

            globalCache.set(cacheKey, tasks)
            return tasks
        } catch (err) {
            console.error('Error loading future tasks:', err)
            return []
        }
    }, [userId, supabase])

    // Optimized batch operations
    const batchUpdate = useCallback(async (operations: Array<() => Promise<any>>) => {
        setLoading(true)
        try {
            await Promise.all(operations)
            // Invalidate relevant cache entries
            globalCache.invalidate(userId)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Batch operation failed')
        } finally {
            setLoading(false)
        }
    }, [userId])

    // Preload data for better UX
    const preloadData = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0]
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        // Preload today and tomorrow's data
        Promise.all([
            loadFutureTasks(today),
            loadFutureTasks(tomorrow),
            loadNotes()
        ])
    }, [loadFutureTasks, loadNotes])

    return {
        loading,
        error,
        loadNotes,
        loadFutureTasks,
        batchUpdate,
        preloadData,
        cache: globalCache
    }
}