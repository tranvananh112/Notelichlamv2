"use client"

import { memo, useMemo, useState, useCallback, useRef, useEffect } from "react"
import { calculateVisibleItems } from "./performance-optimizations"

interface VirtualListProps<T> {
    items: T[]
    itemHeight: number
    containerHeight: number
    renderItem: (item: T, index: number) => React.ReactNode
    keyExtractor: (item: T, index: number) => string
    overscan?: number
    className?: string
    onScroll?: (scrollTop: number) => void
}

function VirtualList<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    keyExtractor,
    overscan = 5,
    className = "",
    onScroll
}: VirtualListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const { startIndex, endIndex, visibleItems } = useMemo(() => {
        const { startIndex: start, endIndex: end } = calculateVisibleItems(
            scrollTop,
            itemHeight,
            containerHeight,
            items.length
        )

        const actualStart = Math.max(0, start - overscan)
        const actualEnd = Math.min(items.length - 1, end + overscan)

        return {
            startIndex: actualStart,
            endIndex: actualEnd,
            visibleItems: items.slice(actualStart, actualEnd + 1)
        }
    }, [scrollTop, itemHeight, containerHeight, items.length, overscan, items])

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const newScrollTop = e.currentTarget.scrollTop
        setScrollTop(newScrollTop)
        onScroll?.(newScrollTop)
    }, [onScroll])

    const totalHeight = items.length * itemHeight
    const offsetY = startIndex * itemHeight

    return (
        <div
            ref={containerRef}
            className={`overflow-auto ${className}`}
            style={{ height: containerHeight }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div
                    style={{
                        transform: `translateY(${offsetY}px)`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                >
                    {visibleItems.map((item, index) => {
                        const actualIndex = startIndex + index
                        return (
                            <div
                                key={keyExtractor(item, actualIndex)}
                                style={{ height: itemHeight }}
                            >
                                {renderItem(item, actualIndex)}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default memo(VirtualList) as typeof VirtualList