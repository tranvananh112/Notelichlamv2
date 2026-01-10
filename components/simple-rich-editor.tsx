"use client"

import { useState, useRef, useCallback } from "react"
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
    Palette
} from "lucide-react"

interface SimpleRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: number
}

const TEXT_COLORS = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FFA500", "#800080", "#FFC0CB", "#A52A2A", "#808080"
]

export default function SimpleRichEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    minHeight = 200
}: SimpleRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showColors, setShowColors] = useState(false)

    const execCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }, [onChange])

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }, [onChange])

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
        handleInput()
    }, [handleInput])

    return (
        <Card className="border border-slate-300 dark:border-slate-600">
            {/* Simple Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-1 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('bold')}
                        className="p-2"
                        title="In đậm"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('italic')}
                        className="p-2"
                        title="In nghiêng"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('underline')}
                        className="p-2"
                        title="Gạch chân"
                    >
                        <Underline className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('justifyLeft')}
                        className="p-2"
                        title="Căn trái"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('justifyCenter')}
                        className="p-2"
                        title="Căn giữa"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('justifyRight')}
                        className="p-2"
                        title="Căn phải"
                    >
                        <AlignRight className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('insertUnorderedList')}
                        className="p-2"
                        title="Danh sách"
                    >
                        <List className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => execCommand('insertOrderedList')}
                        className="p-2"
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
                            className="p-2"
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
                                            className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                execCommand('foreColor', color)
                                                setShowColors(false)
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Font Size */}
                    <select
                        onChange={(e) => execCommand('fontSize', e.target.value)}
                        className="px-2 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-700"
                        defaultValue="3"
                    >
                        <option value="1">8pt</option>
                        <option value="2">10pt</option>
                        <option value="3">12pt</option>
                        <option value="4">14pt</option>
                        <option value="5">18pt</option>
                        <option value="6">24pt</option>
                        <option value="7">36pt</option>
                    </select>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                style={{
                    minHeight,
                    direction: 'ltr',
                    textAlign: 'left'
                }}
                onInput={handleInput}
                onPaste={handlePaste}
                dangerouslySetInnerHTML={{ __html: value }}
                data-placeholder={placeholder}
            />

            {/* Click outside to close color picker */}
            {showColors && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowColors(false)}
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
                }
                [contenteditable]:focus {
                    outline: none;
                }
            `}</style>
        </Card>
    )
}