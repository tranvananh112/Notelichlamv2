// Performance optimization utilities and components

import { memo, useMemo, useCallback, useState, useEffect } from 'react'

// Memoized date formatter
export const formatDate = memo(({ date }: { date: Date }) => {
    const weekDays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"]
    const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
    ]

    return `${weekDays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
})

formatDate.displayName = "FormatDate"

// Optimized loading skeleton
export const LoadingSkeleton = memo(() => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
))

LoadingSkeleton.displayName = "LoadingSkeleton"

// Debounced search hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

// Optimized batch operations
export class BatchProcessor {
    private queue: Array<() => Promise<any>> = []
    private processing = false
    private batchSize = 5
    private delay = 100

    add(operation: () => Promise<any>) {
        this.queue.push(operation)
        this.process()
    }

    private async process() {
        if (this.processing || this.queue.length === 0) return

        this.processing = true

        while (this.queue.length > 0) {
            const batch = this.queue.splice(0, this.batchSize)

            try {
                await Promise.all(batch.map(op => op()))
            } catch (error) {
                console.error('Batch processing error:', error)
            }

            if (this.queue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, this.delay))
            }
        }

        this.processing = false
    }
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    options: IntersectionObserverInit = {}
) {
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, options)

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [elementRef, options])

    return isIntersecting
}

// Virtual scrolling utilities
export const calculateVisibleItems = (
    scrollTop: number,
    itemHeight: number,
    containerHeight: number,
    totalItems: number
) => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        totalItems - 1
    )

    return { startIndex, endIndex }
}

// Performance monitoring
export class PerformanceMonitor {
    private static instance: PerformanceMonitor
    private metrics: Map<string, number[]> = new Map()

    static getInstance() {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor()
        }
        return PerformanceMonitor.instance
    }

    startMeasure(name: string) {
        performance.mark(`${name}-start`)
    }

    endMeasure(name: string) {
        performance.mark(`${name}-end`)
        performance.measure(name, `${name}-start`, `${name}-end`)

        const measure = performance.getEntriesByName(name)[0]
        if (measure) {
            const existing = this.metrics.get(name) || []
            existing.push(measure.duration)
            this.metrics.set(name, existing.slice(-10)) // Keep last 10 measurements
        }
    }

    getAverageTime(name: string): number {
        const times = this.metrics.get(name) || []
        return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
    }

    logMetrics() {
        console.group('Performance Metrics')
        for (const [name, times] of this.metrics) {
            console.log(`${name}: ${this.getAverageTime(name).toFixed(2)}ms avg`)
        }
        console.groupEnd()
    }
}