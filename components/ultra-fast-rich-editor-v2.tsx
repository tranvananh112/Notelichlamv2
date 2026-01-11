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

interface UltraFastRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: number
}

// Optimized color arrays - memoized outside component
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

export default function UltraFastRichEditorV2({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    minHeight = 200
}: UltraFastRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showColors, setShowColors] = useState(false)
    const [showBullets, setShowBullets] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Ultra-fast active states with minimal re-renders
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

    // Hyper-optimized state checking with minimal DOM queries
    const checkActiveStates = useCallback(() => {
        if (!editorRef.current) return

        try {
            // Batch DOM queries for better performance
            const commands = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'insertUnorderedList', 'insertOrderedList']
            const newStates = {} as any

            commands.forEach(cmd => {
                newStates[cmd] = document.queryCommandState(cmd)
            })

            setActiveStates(newStates)
        } catch (error) {
            // Silent fail for performance
        }
    }, [])

    // Ultra-throttled state checking - only when needed
    const throttledCheckStates = useMemo(() => {
        let timeout: NodeJS.Timeout
        return () => {
            clearTimeout(timeout)
            timeout = setTimeout(checkActiveStates, 32) // ~30fps for state checking
        }
    }, [checkActiveStates])

    // Initialize editor - optimized with proper HTML content handling
    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            // Only update if content is different to avoid cursor jumping
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || ""
            }
            if (!isReady) {
                setIsReady(true)
            }
        }
    }, [value, isReady])

    // Hyper-fast command execution
    const executeCommand = useCallback((command: string, value?: string) => {
        if (!editorRef.current) return

        try {
            editorRef.current.focus()
            document.execCommand(command, false, value)

            // Immediate content update - no delays
            const content = editorRef.current.innerHTML
            onChange(content)

            // Minimal state check delay
            throttledCheckStates()
        } catch (error) {
            // Silent fail for performance
        }
    }, [onChange, throttledCheckStates])

    // Hyper-optimized input handling with batching
    const handleInput = useCallback(() => {
        if (!editorRef.current) return

        // Clear any pending updates
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current)
        }

        // Immediate update for responsiveness
        const content = editorRef.current.innerHTML
        onChange(content)

        // Batch state updates
        updateTimeoutRef.current = setTimeout(() => {
            throttledCheckStates()
        }, 16) // 60fps for state updates
    }, [onChange, throttledCheckStates])

    // Lightning-fast bullet insertion
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

    // Lightning keyboard shortcuts
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

        // Lightning Tab bullet
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
            timeout = setTimeout(throttledCheckStates, 50) // Minimal delay
        }

        document.addEventListener('selectionchange', handleSelectionChange)
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange)
            clearTimeout(timeout)
        }
    }, [throttledCheckStates])

    // Memoized button classes for zero re-computation
    const getButtonClass = useCallback((isActive: boolean, baseColor: string) => {
        return `p-2 transition-all duration-75 ${isActive
            ? `bg-${baseColor}-500 text-white hover:bg-${baseColor}-600 shadow-md scale-105`
            : `hover:bg-${baseColor}-100 dark:hover:bg-${baseColor}-900`
            }`
    }, [])

    return (
        <Card className="border border-slate-300 dark:border-slate-600 overflow-hidden">
            {/* Lightning-Fast Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Quick Bullets */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBullets(!showBullets)}
                            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-75"
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
                                            className="w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center justify-center text-sm font-bold transition-all duration-75 hover:scale-110 shadow-sm"
                                        >
                                            {bullet}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Lightning Format Buttons */}
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

                    {/* Lightning Alignment */}
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

                    {/* Lightning Lists */}
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

                    {/* Lightning Color Picker */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColors(!showColors)}
                            className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors duration-75"
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
                                                className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform duration-75"
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
                                                    className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform duration-75"
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
                                            className="w-5 h-5 rounded border border-slate-300 hover:scale-110 transition-transform duration-75"
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

                    {/* Lightning Undo/Redo */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('undo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-75"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('redo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-75"
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Lightning Mode Indicator */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-600 dark:text-green-400">
                        <Zap className="w-3 h-3" />
                        <span>Lightning</span>
                    </div>
                </div>
            </div>

            {/* Lightning Editor */}
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
                /* Lightning-fast transitions */
                * {
                    transition-duration: 75ms !important;
                }
            `}</style>
        </Card>
    )
}