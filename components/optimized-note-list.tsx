"use client"

import { memo, useMemo, useState, useCallback } from "react"
import { FixedSizeList as List } from "react-window"
import ModernNoteCard from "./modern-note-card"

interface Note {
    id: string
    text: string
    timestamp: string
    type: "note" | "attendance"
    color?: string
    progress?: number
    completed?: boolean
    status?: string
}

interface OptimizedNoteListProps {
    notes: Note[]
    onDeleteNote: (noteId: string) => void
    onUpdateNote: (noteId: string, updates: Partial<Note>) => void
    onToggleComplete: (noteId: string, currentStatus: boolean) => void
    onEditNote: (note: Note) => void
    height?: number
    itemHeight?: number
}

const NoteItem = memo(({ index, style, data }: any) => {
    const { notes, onDeleteNote, onUpdateNote, onToggleComplete, onEditNote } = data
    const note = notes[index]

    if (!note) return null

    return (
        <div style={style} className="px-2">
            <ModernNoteCard
                note={note}
                onDelete={() => onDeleteNote(note.id)}
                onToggleComplete={() => onToggleComplete(note.id, note.completed || false)}
                onEdit={() => note.type !== "attendance" && onEditNote(note)}
                onUpdateStatus={(status) => onUpdateNote(note.id, { status })}
            />
        </div>
    )
})

NoteItem.displayName = "NoteItem"

const OptimizedNoteList = memo(({
    notes,
    onDeleteNote,
    onUpdateNote,
    onToggleComplete,
    onEditNote,
    height = 400,
    itemHeight = 120
}: OptimizedNoteListProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<"all" | "note" | "attendance">("all")

    // Memoized filtered notes
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = note.text.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = filterType === "all" || note.type === filterType
            return matchesSearch && matchesType
        })
    }, [notes, searchTerm, filterType])

    // Memoized item data to prevent unnecessary re-renders
    const itemData = useMemo(() => ({
        notes: filteredNotes,
        onDeleteNote,
        onUpdateNote,
        onToggleComplete,
        onEditNote
    }), [filteredNotes, onDeleteNote, onUpdateNote, onToggleComplete, onEditNote])

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value)
    }, [])

    if (filteredNotes.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-center">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                        {searchTerm ? "Không tìm thấy ghi chú phù hợp" : "Chưa có ghi chú"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Thêm ghi chú đầu tiên của bạn"}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm ghi chú..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                    <option value="all">Tất cả</option>
                    <option value="note">Ghi chú</option>
                    <option value="attendance">Điểm danh</option>
                </select>
            </div>

            {/* Results count */}
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Hiển thị {filteredNotes.length} / {notes.length} ghi chú
            </div>

            {/* Virtualized List */}
            <List
                height={height}
                itemCount={filteredNotes.length}
                itemSize={itemHeight}
                itemData={itemData}
                className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
            >
                {NoteItem}
            </List>
        </div>
    )
})

OptimizedNoteList.displayName = "OptimizedNoteList"

export default OptimizedNoteList