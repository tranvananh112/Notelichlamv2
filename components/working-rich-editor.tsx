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
    Redo
} from "lucide-react"

interface WorkingRichEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    minHeight?: number
}

const TEXT_COLORS = [
    "#000000", "#FF0000", "#00AA00", "#0000FF", "#FF6600", "#800080",
    "#008080", "#808080", "#FF69B4", "#32CD32", "#FFD700", "#FF4500"
]

export default function WorkingRichEditor({
    value,
    onChange,
    placeholder = "Nhập nội dung...",
    minHeight = 200
}: WorkingRichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [showColors, setShowColors] = useState(false)
    const [isReady, setIsReady] = useState(false)

    // Initialize editor
    useEffect(() => {
        if (editorRef.current && !isReady) {
            editorRef.current.innerHTML = value || ""
            setIsReady(true)
        }
    }, [value, isReady])

    // Simple command execution
    const executeCommand = useCallback((command: string, value?: string) => {
        try {
            document.execCommand(command, false, value)
            updateContent()
        } catch (error) {
            console.warn('Command failed:', command, error)
        }
    }, [])

    // Update content
    const updateContent = useCallback(() => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML
            onChange(content)
        }
    }, [onChange])

    // Handle input with debounce
    const handleInput = useCallback(() => {
        updateContent()
    }, [updateContent])

    // Handle paste - clean HTML
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
        updateContent()
    }, [updateContent])

    // Keyboard shortcuts
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
            }
        }
    }, [executeCommand])

    return (
        <Card className="border border-slate-300 dark:border-slate-600 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-1 flex-wrap">
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
                        title="Căn giữa"
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
                        title="Danh sách"
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
                </div>
            </div>

            {/* Editor */}
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