"use client"

import { useMemo } from "react"

interface RichNoteDisplayProps {
    content: string
    className?: string
}

export default function RichNoteDisplay({ content, className = "" }: RichNoteDisplayProps) {
    // Clean and sanitize HTML content
    const sanitizedContent = useMemo(() => {
        if (!content) return ""

        // If content is plain text, return as is
        if (!content.includes('<')) {
            return content
        }

        // Basic HTML sanitization - only allow safe tags
        let cleaned = content
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')

        return cleaned
    }, [content])

    return (
        <>
            <div
                className={`rich-note-content ${className}`}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                style={{
                    lineHeight: '1.6',
                    wordBreak: 'break-word'
                }}
            />
            <style jsx>{`
                .rich-note-content p {
                    margin: 0.25em 0;
                }
                .rich-note-content b,
                .rich-note-content strong {
                    font-weight: 600;
                }
                .rich-note-content i,
                .rich-note-content em {
                    font-style: italic;
                }
                .rich-note-content u {
                    text-decoration: underline;
                }
                .rich-note-content ul {
                    margin: 0.5em 0;
                    padding-left: 1.2em;
                    list-style-type: disc;
                }
                .rich-note-content ol {
                    margin: 0.5em 0;
                    padding-left: 1.2em;
                    list-style-type: decimal;
                }
                .rich-note-content li {
                    margin: 0.2em 0;
                }
                .rich-note-content [style*="text-align: center"] {
                    text-align: center;
                }
                .rich-note-content [style*="text-align: right"] {
                    text-align: right;
                }
                .rich-note-content [style*="text-align: left"] {
                    text-align: left;
                }
                .rich-note-content font[color] {
                    /* Preserve font colors */
                }
            `}</style>
        </>
    )
}