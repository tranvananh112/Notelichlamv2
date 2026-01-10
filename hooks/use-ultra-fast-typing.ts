"use client"

import { useCallback, useRef, useMemo } from "react"

interface TypingOptimizations {
    throttleDelay: number
    batchSize: number
    enableVirtualization: boolean
    enablePredictiveText: boolean
}

const DEFAULT_OPTIONS: TypingOptimizations = {
    throttleDelay: 16, // 60fps
    batchSize: 10,
    enableVirtualization: true,
    enablePredictiveText: false
}

export function useUltraFastTyping(
    onChange: (value: string) => void,
    options: Partial<TypingOptimizations> = {}
) {
    const opts = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options])
    const pendingChanges = useRef<string[]>([])
    const timeoutRef = useRef<NodeJS.Timeout>()
    const lastValue = useRef<string>("")

    // Ultra-fast batched updates
    const flushChanges = useCallback(() => {
        if (pendingChanges.current.length > 0) {
            const latestValue = pendingChanges.current[pendingChanges.current.length - 1]
            if (latestValue !== lastValue.current) {
                onChange(latestValue)
                lastValue.current = latestValue
            }
            pendingChanges.current = []
        }
    }, [onChange])

    // Throttled change handler
    const handleChange = useCallback((value: string) => {
        pendingChanges.current.push(value)

        // Immediate update for better responsiveness
        if (pendingChanges.current.length === 1) {
            onChange(value)
            lastValue.current = value
        }

        // Batch subsequent changes
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            flushChanges()
        }, opts.throttleDelay)

        // Force flush if batch is full
        if (pendingChanges.current.length >= opts.batchSize) {
            flushChanges()
        }
    }, [onChange, opts.throttleDelay, opts.batchSize, flushChanges])

    // Optimized input event handler
    const handleInput = useCallback((e: Event) => {
        const target = e.target as HTMLElement
        if (target && target.innerHTML !== undefined) {
            handleChange(target.innerHTML)
        }
    }, [handleChange])

    // Fast keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Prevent default for common shortcuts to avoid browser lag
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                case 'i':
                case 'u':
                case 'z':
                case 'y':
                    e.preventDefault()
                    break
            }
        }
    }, [])

    // Optimized paste handler
    const handlePaste = useCallback((e: ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData?.getData('text/plain') || ""

        // Use execCommand for better performance
        if (document.execCommand) {
            document.execCommand('insertText', false, text)
        } else {
            // Fallback for modern browsers
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0)
                range.deleteContents()
                range.insertNode(document.createTextNode(text))
                range.collapse(false)
                selection.removeAllRanges()
                selection.addRange(range)
            }
        }
    }, [])

    // Performance monitoring
    const measurePerformance = useCallback((operation: string, fn: () => void) => {
        const start = performance.now()
        fn()
        const end = performance.now()

        if (process.env.NODE_ENV === 'development') {
            console.log(`⚡ ${operation}: ${(end - start).toFixed(2)}ms`)
        }
    }, [])

    return {
        handleInput,
        handleKeyDown,
        handlePaste,
        handleChange,
        measurePerformance,
        flushChanges
    }
}

export default useUltraFastTyping