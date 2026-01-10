"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Link,
    Image,
    Palette,
    Highlighter,
    Type,
    ChevronDown,
    Undo,
    Redo
} from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    minHeight?: number
}

const FONT_FAMILIES = [
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica, sans-serif" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
    { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
]

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

const TEXT_COLORS = [
    "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
    "#FF0000", "#FF6600", "#FFCC00", "#FFFF00", "#CCFF00", "#66FF00",
    "#00FF00", "#00FF66", "#00FFCC", "#00FFFF", "#00CCFF", "#0066FF",
    "#0000FF", "#6600FF", "#CC00FF", "#FF00FF", "#FF00CC", "#FF0066"
]

const HIGHLIGHT_COLORS = [
    "transparent", "#FFFF00", "#00FF00", "#00FFFF", "#FF00FF",
    "#FF0000", "#0000FF", "#FFA500", "#800080", "#FFC0CB"
]

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    className = "",
    minHeight = 200
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showFontFamily, setShowFontFamily] = useState(false)
    const [showFontSize, setShowFontSize] = useState(false)
    const [showTextColor, setShowTextColor] = useState(false)
    const [showHighlight, setShowHighlight] = useState(false)
    const [currentFont, setCurrentFont] = useState("Arial")
    const [currentSize, setCurrentSize] = useState(14)

    // Initialize editor content
    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    // Execute formatting command with proper focus handling
    const execCommand = useCallback((command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus()
            document.execCommand(command, false, value)
            handleInput()
        }
    }, [])

    // Handle content change with proper event handling
    const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML
            onChange(content)
        }
    }, [onChange])

    // Insert HTML at cursor
    const insertHTML = useCallback((html: string) => {
        if (editorRef.current) {
            editorRef.current.focus()
            document.execCommand('insertHTML', false, html)
            handleInput({} as React.FormEvent<HTMLDivElement>)
        }
    }, [handleInput])

    // Handle key events to prevent issues
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Handle common shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault()
                    execCommand('bold')
                    break
                case 'i':
                    e.preventDefault()
                    execCommand('italic')
                    break
                case 'u':
                    e.preventDefault()
                    execCommand('underline')
                    break
                case 'z':
                    e.preventDefault()
                    execCommand(e.shiftKey ? 'redo' : 'undo')
                    break
            }
        }
    }, [execCommand])

    // Format buttons data
    const formatButtons = [
        { command: "bold", icon: Bold, title: "In đậm (Ctrl+B)" },
        { command: "italic", icon: Italic, title: "In nghiêng (Ctrl+I)" },
        { command: "underline", icon: Underline, title: "Gạch chân (Ctrl+U)" },
        { command: "strikeThrough", icon: Strikethrough, title: "Gạch ngang" },
    ]

    const alignButtons = [
        { command: "justifyLeft", icon: AlignLeft, title: "Căn trái" },
        { command: "justifyCenter", icon: AlignCenter, title: "Căn giữa" },
        { command: "justifyRight", icon: AlignRight, title: "Căn phải" },
        { command: "justifyFull", icon: AlignJustify, title: "Căn đều" },
    ]

    const listButtons = [
        { command: "insertUnorderedList", icon: List, title: "Danh sách không thứ tự" },
        { command: "insertOrderedList", icon: ListOrdered, title: "Danh sách có thứ tự" },
    ]

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'b':
                        e.preventDefault()
                        execCommand('bold')
                        break
                    case 'i':
                        e.preventDefault()
                        execCommand('italic')
                        break
                    case 'u':
                        e.preventDefault()
                        execCommand('underline')
                        break
                    case 'z':
                        e.preventDefault()
                        execCommand('undo')
                        break
                    case 'y':
                        e.preventDefault()
                        execCommand('redo')
                        break
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [execCommand])

    return (
        <Card className={`border border-slate-300 dark:border-slate-600 ${className}`}>
            {/* Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Font Family */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFontFamily(!showFontFamily)}
                            className="min-w-[140px] justify-between"
                        >
                            <span className="truncate">{currentFont}</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                        {showFontFamily && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {FONT_FAMILIES.map((font) => (
                                    <button
                                        key={font.name}
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                                        style={{ fontFamily: font.value }}
                                        onClick={() => {
                                            execCommand('fontName', font.value)
                                            setCurrentFont(font.name)
                                            setShowFontFamily(false)
                                        }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Font Size */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFontSize(!showFontSize)}
                            className="min-w-[60px] justify-between"
                        >
                            <span>{currentSize}</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                        {showFontSize && (
                            <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {FONT_SIZES.map((size) => (
                                    <button
                                        key={size}
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                                        onClick={() => {
                                            execCommand('fontSize', '3')
                                            execCommand('fontsize', size.toString())
                                            setCurrentSize(size)
                                            setShowFontSize(false)
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* Format Buttons */}
                    {formatButtons.map(({ command, icon: Icon, title }) => (
                        <Button
                            key={command}
                            variant="outline"
                            size="sm"
                            onClick={() => execCommand(command)}
                            title={title}
                            className="p-2"
                        >
                            <Icon className="w-4 h-4" />
                        </Button>
                    ))}

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* Text Color */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTextColor(!showTextColor)}
                            title="Màu chữ"
                            className="p-2"
                        >
                            <Type className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                        {showTextColor && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 p-3">
                                <div className="grid grid-cols-6 gap-1">
                                    {TEXT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                execCommand('foreColor', color)
                                                setShowTextColor(false)
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Highlight Color */}
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowHighlight(!showHighlight)}
                            title="Màu nền chữ"
                            className="p-2"
                        >
                            <Highlighter className="w-4 h-4" />
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                        {showHighlight && (
                            <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50 p-3">
                                <div className="grid grid-cols-5 gap-1">
                                    {HIGHLIGHT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                                            style={{
                                                backgroundColor: color === 'transparent' ? '#ffffff' : color,
                                                backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                                                backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
                                                backgroundPosition: color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                                            }}
                                            onClick={() => {
                                                execCommand('hiliteColor', color)
                                                setShowHighlight(false)
                                            }}
                                            title={color === 'transparent' ? 'Không màu' : color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* Alignment Buttons */}
                    {alignButtons.map(({ command, icon: Icon, title }) => (
                        <Button
                            key={command}
                            variant="outline"
                            size="sm"
                            onClick={() => execCommand(command)}
                            title={title}
                            className="p-2"
                        >
                            <Icon className="w-4 h-4" />
                        </Button>
                    ))}

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* List Buttons */}
                    {listButtons.map(({ command, icon: Icon, title }) => (
                        <Button
                            key={command}
                            variant="outline"
                            size="sm"
                            onClick={() => execCommand(command)}
                            title={title}
                            className="p-2"
                        >
                            <Icon className="w-4 h-4" />
                        </Button>
                    ))}

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* Undo/Redo */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('undo')}
                        title="Hoàn tác (Ctrl+Z)"
                        className="p-2"
                    >
                        <Undo className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('redo')}
                        title="Làm lại (Ctrl+Y)"
                        className="p-2"
                    >
                        <Redo className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

                    {/* Special Inserts */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertHTML('<blockquote style="border-left: 4px solid #ccc; margin: 16px 0; padding-left: 16px; font-style: italic;">Trích dẫn</blockquote>')}
                        title="Trích dẫn"
                        className="p-2"
                    >
                        <Quote className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            const url = prompt('Nhập URL:')
                            if (url) {
                                execCommand('createLink', url)
                            }
                        }}
                        title="Chèn liên kết"
                        className="p-2"
                    >
                        <Link className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 outline-none min-h-[200px] prose prose-sm max-w-none dark:prose-invert focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                style={{
                    minHeight,
                    direction: 'ltr',
                    textAlign: 'left',
                    unicodeBidi: 'normal'
                }}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                suppressContentEditableWarning={true}
                data-placeholder={placeholder}
            />

            {/* Click outside to close dropdowns */}
            {(showFontFamily || showFontSize || showTextColor || showHighlight) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setShowFontFamily(false)
                        setShowFontSize(false)
                        setShowTextColor(false)
                        setShowHighlight(false)
                    }}
                />
            )}

            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    font-style: italic;
                    pointer-events: none;
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
            `}</style>
        </Card>
    )
}