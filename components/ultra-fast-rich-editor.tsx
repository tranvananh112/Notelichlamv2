"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Type,
    Undo,
    Redo,
    Zap,
    Sparkles
} from "lucide-react"
import { useUltraFastTyping } from "@/hooks/use-ultra-fast-typing"
import { usePerformanceMonitor } from "./performance-monitor"

interface UltraFastRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: number
}

// Optimized color arrays - memoized
const THEME_COLORS = [
    "#000000", "#FFFFFF", "#1F4E79", "#4472C4", "#C55A5A", "#70AD47", "#7030A0", "#44546A", "#E7E6E6", "#FFC000"
]

const THEME_VARIANTS = [
    ["#F2F2F2", "#FFEBEE", "#E3F2FD", "#E8F5E8", "#FCE4EC", "#F3E5F5", "#E0F2F1", "#FFF3E0", "#FFFDE7", "#F9FBE7"],
    ["#D9D9D9", "#FFCDD2", "#BBDEFB", "#C8E6C8", "#F8BBD0", "#E1BEE7", "#B2DFDB", "#FFE0B2", "#FFF9C4", "#F0F4C3"],
    ["#BFBFBF", "#EF9A9A", "#90CAF9", "#A5D6A7", "#F48FB1", "#CE93D8", "#80CBC4", "#FFCC80", "#FFF176", "#DCE775"],
    ["#A6A6A6", "#E57373", "#64B5F6", "#81C784", "#F06292", "#BA68C8", "#4DB6AC", "#FFB74D", "#FFEE58", "#C5E1A5"],
    ["#808080", "#EF5350", "#42A5F5", "#66BB6A", "#EC407A", "#AB47BC", "#26A69A", "#FFA726", "#FFEB3B", "#AED581"]
]

const STANDARD_COLORS = ["#C00000", "#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B050", "#00B0F0", "#0070C0", "#002060", "#7030A0"]

const BULLET_LIBRARY = [
    "•", "○", "■", "▲", "★", "♦", "→", "✓", "✗", "!", "?", "※", "⚡", "🔥", "💡", "📝"
]

export default function UltraFastRichEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    minHeight = 200
}: UltraFastRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showColors, setShowColors] = useState(false)
    const [showBullets, setShowBullets] = useState(false)
    const [isReady, setIsReady] = useState(false)

    // Performance monitoring
    const performanceMonitor = usePerformanceMonitor()

    // Ultra-fast typing optimization
    const {
        handleInput: optimizedHandleInput,
        handleKeyDown: optimizedHandleKeyDown,
        handlePaste: optimizedHandlePaste,
        measurePerformance
    } = useUltraFastTyping(onChange, {
        throttleDelay: 8, // 120fps for ultra responsiveness
        batchSize: 5,
        enableVirtualization: true
    })

    // Ultra-fast active states with useMemo
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        insertUnorderedList: false,
        insertOrderedList: false
    })

    // Debounced state checking - only check every 100ms
    const checkActiveStates = useCallback(() => {
        if (!editorRef.current) return

        try {
            const newStates = {
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                justifyLeft: document.queryCommandState('justifyLeft'),
                justifyCenter: document.queryCommandState('justifyCenter'),
                justifyRight: document.queryCommandState('justifyRight'),
                insertUnorderedList: document.queryCommandState('insertUnorderedList'),
                insertOrderedList: document.queryCommandState('insertOrderedList')
            }
            setActiveStates(newStates)
        } catch (error) {
            // Silent fail for performance
        }
    }, [])

    // Throttled state checking
    const throttledCheckStates = useMemo(() => {
        let timeout: NodeJS.Timeout
        return () => {
            clearTimeout(timeout)
            timeout = setTimeout(checkActiveStates, 50) // 50ms throttle
        }
    }, [checkActiveStates])

    // Initialize editor - optimized
    useEffect(() => {
        if (editorRef.current && !isReady) {
            editorRef.current.innerHTML = value || ""
            setIsReady(true)
        }
    }, [value, isReady])

    // Ultra-fast command execution with performance monitoring
    const executeCommand = useCallback((command: string, value?: string) => {
        measurePerformance(`Command: ${command}`, () => {
            try {
                if (editorRef.current) {
                    performanceMonitor.startMeasure('command-execution')
                    editorRef.current.focus()
                    document.execCommand(command, false, value)

                    // Immediate content update for max responsiveness
                    const content = editorRef.current.innerHTML
                    onChange(content)

                    // Throttled state check
                    throttledCheckStates()
                    performanceMonitor.endMeasure('command-execution')
                }
            } catch (error) {
                // Silent fail for performance
            }
        })
    }, [onChange, throttledCheckStates, measurePerformance, performanceMonitor])

    // Ultra-fast input handling
    const handleInput = useCallback(() => {
        if (!editorRef.current) return

        // Immediate update without requestAnimationFrame for max speed
        const content = editorRef.current.innerHTML
        onChange(content)

        // Throttled state check
        throttledCheckStates()
    }, [onChange, throttledCheckStates])

    // Fast bullet insertion
    const insertBullet = useCallback((bullet: string) => {
        if (!editorRef.current) return

        editorRef.current.focus()
        document.execCommand('insertText', false, bullet + ' ')

        const content = editorRef.current.innerHTML
        onChange(content)
        setShowBullets(false)
    }, [onChange])

    // Optimized paste handling
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)

        const content = editorRef.current?.innerHTML || ""
        onChange(content)
    }, [onChange])

    // Ultra-fast keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault()
                    executeCommand('bold')
                    break
                case 'i':
                    e.preventDefault()
                    executeCommand('italic')
                    break
                case 'u':
                    e.preventDefault()
                    executeCommand('underline')
                    break
                case 'z':
                    e.preventDefault()
                    executeCommand('undo')
                    break
                case 'y':
                    e.preventDefault()
                    executeCommand('redo')
                    break
                case 'l':
                    e.preventDefault()
                    executeCommand('insertUnorderedList')
                    break
                case 'e':
                    e.preventDefault()
                    executeCommand('justifyCenter')
                    break
            }
        }

        // Ultra-fast Tab bullet
        if (e.key === 'Tab' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault()
            insertBullet('•')
        }
    }, [executeCommand, insertBullet])

    // Optimized selection change handler
    useEffect(() => {
        let timeout: NodeJS.Timeout
        const handleSelectionChange = () => {
            clearTimeout(timeout)
            timeout = setTimeout(throttledCheckStates, 100) // Debounce 100ms
        }

        document.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange)
            clearTimeout(timeout)
        }
    }, [throttledCheckStates])

    // Memoized button classes for performance
    const getButtonClass = useCallback((isActive: boolean, baseColor: string) => {
        return `p-2 transition-all ${isActive
            ? `bg-${baseColor}-500 text-white hover:bg-${baseColor}-600 shadow-md`
            : `hover:bg-${baseColor}-100 dark:hover:bg-${baseColor}-900`
            }`
    }, [])

    return (
        <Card className="border border-slate-300 dark:border-slate-600 overflow-hidden">
            {/* Ultra-Fast Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Quick Bullets - Optimized */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBullets(!showBullets)}
                            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                            title="Bullet Library (Tab for •)"
                        >
                            <Sparkles className="w-4 h-4" />
                        </Button>

                        {showBullets && (
                            <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 w-72">
                                <div className="grid grid-cols-8 gap-1">
                                    {BULLET_LIBRARY.map((bullet) => (
                                        <button
                                            key={bullet}
                                            onClick={() => insertBullet(bullet)}
                                            className="w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center justify-center text-sm font-bold transition-all hover:scale-110 shadow-sm"
                                        >
                                            {bullet}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Ultra-Fast Format Buttons */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('bold')}
                        className={getButtonClass(activeStates.bold, 'blue')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('italic')}
                        className={getButtonClass(activeStates.italic, 'blue')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('underline')}
                        className={getButtonClass(activeStates.underline, 'blue')}
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Ultra-Fast Alignment */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyLeft')}
                        className={getButtonClass(activeStates.justifyLeft, 'green')}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyCenter')}
                        className={getButtonClass(activeStates.justifyCenter, 'green')}
                        title="Center (Ctrl+E)"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyRight')}
                        className={getButtonClass(activeStates.justifyRight, 'green')}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Ultra-Fast Lists */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('insertUnorderedList')}
                        className={getButtonClass(activeStates.insertUnorderedList, 'purple')}
                        title="Bullet List (Ctrl+L)"
                    >
                        <List className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('insertOrderedList')}
                        className={getButtonClass(activeStates.insertOrderedList, 'purple')}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Optimized Color Picker */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColors(!showColors)}
                            className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                            title="Text Color"
                        >
                            <Type className="w-4 h-4" />
                        </Button>

                        {showColors && (
                            <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-xl z-50 w-64">
                                {/* Theme Colors */}
                                <div className="mb-3">
                                    <div className="grid grid-cols-10 gap-1 mb-2">
                                        {THEME_COLORS.map((color, index) => (
                                            <button
                                                key={index}
                                                className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                onClick={() => {
                                                    executeCommand('foreColor', color)
                                                    setShowColors(false)
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Variants */}
                                    {THEME_VARIANTS.map((row, rowIndex) => (
                                        <div key={rowIndex} className="grid grid-cols-10 gap-1 mb-1">
                                            {row.map((color, colIndex) => (
                                                <button
                                                    key={`${rowIndex}-${colIndex}`}
                                                    className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => {
                                                        executeCommand('foreColor', color)
                                                        setShowColors(false)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Standard Colors */}
                                <div className="grid grid-cols-10 gap-1">
                                    {STANDARD_COLORS.map((color, index) => (
                                        <button
                                            key={index}
                                            className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                executeCommand('foreColor', color)
                                                setShowColors(false)
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Ultra-Fast Undo/Redo */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('undo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('redo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Ultra-Fast Mode Indicator */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-600 dark:text-green-400">
                        <Zap className="w-3 h-3" />
                        <span>Ultra Fast</span>
                    </div>
                </div>
            </div>

            {/* Ultra-Fast Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-h-[200px]"
                style={{
                    minHeight,
                    direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal'
                }}
                onInput={handleInput}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
            />

            {/* Click outside handlers */}
            {(showColors || showBullets) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowColors(false)
                        setShowBullets(false)
                    }}
                />
            )}

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    font-style: italic;
                    pointer-events: none;
                    position: absolute;
                }
                [contenteditable] {
                    direction: ltr !important;
                    text-align: left !important;
                    unicode-bidi: normal !important;
                    writing-mode: lr-tb !important;
                }
                [contenteditable]:focus {
                    outline: none;
                }
                [contenteditable] * {
                    direction: ltr !important;
                    unicode-bidi: normal !important;
                }
                [contenteditable] p {
                    margin: 0.5em 0;
                }
                [contenteditable] ul, [contenteditable] ol {
                    margin: 0.5em 0;
                    padding-left: 1.5em;
                }
            `}</style>
        </Card>
    )
}