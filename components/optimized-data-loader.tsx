"use client"

import { Suspense, memo, useState, useCallback, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { LoadingSkeleton } from "./performance-optimizations"

interface OptimizedDataLoaderProps {
    children: React.ReactNode
    fallback?: React.ReactNode
    errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
    onError?: (error: Error) => void
    retryCount?: number
    retryDelay?: number
}

const DefaultErrorFallback = memo(({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Có lỗi xảy ra
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {error.message || "Không thể tải dữ liệu"}
        </p>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            Thử lại
        </button>
    </div>
))

DefaultErrorFallback.displayName = "DefaultErrorFallback"

const RetryWrapper = memo(({
    children,
    retryCount = 3,
    retryDelay = 1000,
    onError
}: {
    children: React.ReactNode
    retryCount?: number
    retryDelay?: number
    onError?: (error: Error) => void
}) => {
    const [attempts, setAttempts] = useState(0)
    const [isRetrying, setIsRetrying] = useState(false)

    const handleError = useCallback((error: Error, errorInfo: any) => {
        console.error('Data loading error:', error, errorInfo)
        onError?.(error)

        if (attempts < retryCount) {
            setIsRetrying(true)
            setTimeout(() => {
                setAttempts(prev => prev + 1)
                setIsRetrying(false)
            }, retryDelay * Math.pow(2, attempts)) // Exponential backoff
        }
    }, [attempts, retryCount, retryDelay, onError])

    const resetError = useCallback(() => {
        setAttempts(0)
        setIsRetrying(false)
    }, [])

    if (isRetrying) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    Đang thử lại... ({attempts + 1}/{retryCount})
                </span>
            </div>
        )
    }

    return (
        <ErrorBoundary
            onError={handleError}
            onReset={resetError}
            FallbackComponent={DefaultErrorFallback}
            resetKeys={[attempts]}
        >
            {children}
        </ErrorBoundary>
    )
})

RetryWrapper.displayName = "RetryWrapper"

const OptimizedDataLoader = memo(({
    children,
    fallback = <LoadingSkeleton />,
    errorFallback: ErrorFallback = DefaultErrorFallback,
    onError,
    retryCount = 3,
    retryDelay = 1000
}: OptimizedDataLoaderProps) => {
    return (
        <RetryWrapper
            retryCount={retryCount}
            retryDelay={retryDelay}
            onError={onError}
        >
            <Suspense fallback={fallback}>
                {children}
            </Suspense>
        </RetryWrapper>
    )
})

OptimizedDataLoader.displayName = "OptimizedDataLoader"

export default OptimizedDataLoader

// Hook for data loading with automatic retry
export function useDataLoader<T>(
    loadFn: () => Promise<T>,
    deps: React.DependencyList = [],
    options: {
        retryCount?: number
        retryDelay?: number
        cacheKey?: string
        cacheTTL?: number
    } = {}
) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [attempts, setAttempts] = useState(0)

    const { retryCount = 3, retryDelay = 1000, cacheKey, cacheTTL = 5 * 60 * 1000 } = options

    const loadData = useCallback(async () => {
        // Check cache first
        if (cacheKey) {
            const cached = localStorage.getItem(cacheKey)
            if (cached) {
                try {
                    const { data: cachedData, timestamp } = JSON.parse(cached)
                    if (Date.now() - timestamp < cacheTTL) {
                        setData(cachedData)
                        setLoading(false)
                        return
                    }
                } catch (e) {
                    localStorage.removeItem(cacheKey)
                }
            }
        }

        setLoading(true)
        setError(null)

        for (let attempt = 0; attempt <= retryCount; attempt++) {
            try {
                const result = await loadFn()

                // Cache the result
                if (cacheKey) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: result,
                        timestamp: Date.now()
                    }))
                }

                setData(result)
                setError(null)
                setAttempts(0)
                break
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Unknown error')

                if (attempt === retryCount) {
                    setError(error)
                    setAttempts(attempt + 1)
                } else {
                    // Wait before retry with exponential backoff
                    await new Promise(resolve =>
                        setTimeout(resolve, retryDelay * Math.pow(2, attempt))
                    )
                }
            }
        }

        setLoading(false)
    }, [loadFn, retryCount, retryDelay, cacheKey, cacheTTL])

    useEffect(() => {
        loadData()
    }, deps)

    const retry = useCallback(() => {
        setAttempts(0)
        loadData()
    }, [loadData])

    return { data, loading, error, retry, attempts }
}