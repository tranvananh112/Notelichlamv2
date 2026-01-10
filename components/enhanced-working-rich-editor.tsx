"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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

interface EnhancedWorkingRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: number
}

const TEXT_COLORS = [
    "#000000", "#FF0000", "#00AA00", "#0000FF", "#FF6600", "#800080",
    "#008080", "#808080", "#FF69B4", "#32CD32", "#FFD700", "#FF4500"
]

// Bullet Library - Thư viện ký hiệu
const BULLET_LIBRARY = [
    { symbol: "•", name: "Bullet", category: "basic" },
    { symbol: "○", name: "Circle", category: "basic" },
    { symbol: "■", name: "Square", category: "basic" },
    { symbol: "▲", name: "Triangle", category: "basic" },
    { symbol: "★", name: "Star", category: "basic" },
    { symbol: "♦", name: "Diamond", category: "basic" },
    { symbol: "→", name: "Arrow", category: "basic" },
    { symbol: "✓", name: "Check", category: "basic" },
    { symbol: "✗", name: "Cross", category: "symbols" },
    { symbol: "!", name: "Important", category: "symbols" },
    { symbol: "?", name: "Question", category: "symbols" },
    { symbol: "※", name: "Note", category: "symbols" },
    { symbol: "⚡", name: "Priority", category: "emojis" },
    { symbol: "🔥", name: "Hot", category: "emojis" },
    { symbol: "💡", name: "Idea", category: "emojis" },
    { symbol: "📝", name: "Task", category: "emojis" },
]

export default function EnhancedWorkingRichEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    minHeight = 200
}: EnhancedWorkingRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showColors, setShowColors] = useState(false)
    const [showBullets, setShowBullets] = useState(false)
    const [isReady, setIsReady] = useState(false)

    // Initialize editor
    useEffect(() => {
        if (editorRef.current && !isReady) {
            editorRef.current.innerHTML = value || ""
            setIsReady(true)
        }
    }, [value, isReady])

    // Optimized command execution with debounce
    const executeCommand = useCallback((command: string, value?: string) => {
        try {
            if (editorRef.current) {
                editorRef.current.focus()
                document.execCommand(command, false, value)
                // Immediate update for better responsiveness
                requestAnimationFrame(() => {
                    updateContent()
                })
            }
        } catch (error) {
            console.warn('Command failed:', command, error)
        }
    }, [])

    // Optimized content update
    const updateContent = useCallback(() => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML
            onChange(content)
        }
    }, [onChange])

    // Fast input handling
    const handleInput = useCallback(() => {
        // Use requestAnimationFrame for smooth performance
        requestAnimationFrame(() => {
            updateContent()
        })
    }, [updateContent])

    // Insert bullet at cursor
    const insertBullet = useCallback((bullet: string) => {
        if (editorRef.current) {
            editorRef.current.focus()
            document.execCommand('insertText', false, bullet + ' ')
            updateContent()
            setShowBullets(false)
        }
    }, [updateContent])

    // Enhanced paste handling
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
        updateContent()
    }, [updateContent])

    // Enhanced keyboard shortcuts
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Fast shortcuts
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

        // Quick bullet insertion with Tab
        if (e.key === 'Tab' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault()
            insertBullet('•')
        }
    }, [executeCommand, insertBullet])

    return (
        <Card className="border border-slate-300 dark:border-slate-600 overflow-hidden">
            {/* Enhanced Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Quick Bullets */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowBullets(!showBullets)}
                            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                            title="Bullet Library (Tab for quick •)"
                        >
                            <Sparkles className="w-4 h-4" />
                        </Button>

                        {showBullets && (
                            <div className="absolute top-full left-0 mt-1 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 w-80">
                                <div className="mb-2">
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                                        Bullet Library - Click để chèn
                                    </p>
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                    {BULLET_LIBRARY.map((bullet) => (
                                        <button
                                            key={bullet.symbol}
                                            onClick={() => insertBullet(bullet.symbol)}
                                            className="w-8 h-8 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 flex items-center justify-center text-sm font-bold transition-all hover:scale-110 shadow-sm"
                                            title={bullet.name}
                                        >
                                            {bullet.symbol}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    💡 Tip: Nhấn Tab để chèn nhanh bullet •
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Format Buttons */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('bold')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900"
                        title="In đậm (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('italic')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900"
                        title="In nghiêng (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('underline')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900"
                        title="Gạch chân (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Alignment */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyLeft')}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900"
                        title="Căn trái"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyCenter')}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900"
                        title="Căn giữa (Ctrl+E)"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('justifyRight')}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900"
                        title="Căn phải"
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Lists */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('insertUnorderedList')}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900"
                        title="Danh sách (Ctrl+L)"
                    >
                        <List className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('insertOrderedList')}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900"
                        title="Danh sách số"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Color Picker */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColors(!showColors)}
                            className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                            title="Màu chữ"
                        >
                            <Type className="w-4 h-4" />
                        </Button>

                        {showColors && (
                            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50">
                                <div className="grid grid-cols-6 gap-1">
                                    {TEXT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform shadow-sm"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                executeCommand('foreColor', color)
                                                setShowColors(false)
                                            }}
                                            title={`Màu ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Font Size */}
                    <select
                        onChange={(e) => executeCommand('fontSize', e.target.value)}
                        className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                        defaultValue="3"
                        title="Kích thước chữ"
                    >
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="3">12pt</option>
                        <option value="4">14pt</option>
                        <option value="5">18pt</option>
                        <option value="6">24pt</option>
                        <option value="7">36pt</option>
                    </select>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Undo/Redo */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('undo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
                        title="Hoàn tác (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => executeCommand('redo')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900"
                        title="Làm lại (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    {/* Speed Indicator */}
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-600 dark:text-green-400">
                        <Zap className="w-3 h-3" />
                        <span>Fast Mode</span>
                    </div>
                </div>
            </div>

            {/* Optimized Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 min-h-[200px]"
                style={{
                    minHeight,
                    direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal',
                    writingMode: 'lr-tb'
                }}
                onInput={handleInput}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
            />

            {/* Click outside to close dropdowns */}
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
                /* Smooth typing animation */
                [contenteditable] {
                    transition: all 0.1s ease;
                }
            `}</style>
        </Card>
    )
}