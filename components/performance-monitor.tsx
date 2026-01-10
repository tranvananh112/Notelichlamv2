"use client"

import { useEffect, useRef } from "react"

interface PerformanceMetrics {
    renderTime: number
    inputLatency: number
    memoryUsage: number
    frameRate: number
}

class PerformanceMonitor {
    private static instance: PerformanceMonitor
    private metrics: Map<string, number> = new Map()
    private frameCount = 0
    private lastFrameTime = 0
    private frameRate = 0

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor()
        }
        return PerformanceMonitor.instance
    }

    startMeasure(name: string): void {
        this.metrics.set(`${name}_start`, performance.now())
    }

    endMeasure(name: string): number {
        const startTime = this.metrics.get(`${name}_start`)
        if (startTime) {
            const duration = performance.now() - startTime
            this.metrics.set(name, duration)
            return duration
        }
        return 0
    }

    measureFrameRate(): void {
        const now = performance.now()
        if (this.lastFrameTime) {
            const delta = now - this.lastFrameTime
            this.frameRate = 1000 / delta
        }
        this.lastFrameTime = now
        this.frameCount++

        requestAnimationFrame(() => this.measureFrameRate())
    }

    getMetrics(): PerformanceMetrics {
        const memory = (performance as any).memory
        return {
            renderTime: this.metrics.get('render') || 0,
            inputLatency: this.metrics.get('input') || 0,
            memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
            frameRate: Math.round(this.frameRate)
        }
    }

    logMetrics(): void {
        const metrics = this.getMetrics()
        console.group('🚀 Performance Metrics')
        console.log(`📊 Render Time: ${metrics.renderTime.toFixed(2)}ms`)
        console.log(`⚡ Input Latency: ${metrics.inputLatency.toFixed(2)}ms`)
        console.log(`🧠 Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB`)
        console.log(`🎯 Frame Rate: ${metrics.frameRate}fps`)
        console.groupEnd()
    }
}

export function usePerformanceMonitor() {
    const monitor = useRef(PerformanceMonitor.getInstance())

    useEffect(() => {
        // Start frame rate monitoring
        monitor.current.measureFrameRate()

        // Log metrics every 10 seconds in development
        if (process.env.NODE_ENV === 'development') {
            const interval = setInterval(() => {
                monitor.current.logMetrics()
            }, 10000)

            return () => clearInterval(interval)
        }
    }, [])

    return monitor.current
}

export default PerformanceMonitor