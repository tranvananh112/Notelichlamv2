"use client"

import { useMemo } from "react"

interface RichNoteDisplayProps {
    content: string
    className?: string
}

// Regex để detect URLs
const URL_REGEX = /(https?:\/\/[^\s<>"]+)/g

export default function RichNoteDisplay({ content, className = "" }: RichNoteDisplayProps) {
    // Clean, sanitize and linkify content
    const processedContent = useMemo(() => {
        if (!content) return ""

        let processed = content

        // If content is plain text, linkify URLs first
        if (!content.includes('<')) {
            // Linkify URLs in plain text
            processed = content.replace(URL_REGEX, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer break-all">${url}</a>`
            })
        } else {
            // For rich text, we need to be more careful
            // First sanitize, then linkify text nodes only
            processed = content
                .replace(/<script[^>]*>.*?<\/script>/gi, '')
                .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+="[^"]*"/gi, '')

            // Linkify URLs that are not already inside <a> tags
            processed = processed.replace(/(?<!<a[^>]*>)(?<!href=["'])https?:\/\/[^\s<>"]+(?![^<]*<\/a>)/g, (url) => {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer break-all">${url}</a>`
            })
        }

        return processed
    }, [content])

    return (
        <>
            <div
                className={`rich-note-content ${className}`}
                dangerouslySetInnerHTML={{ __html: processedContent }}
                style={{
                    lineHeight: '1.6',
                    wordBreak: 'break-word'
                }}
                onClick={(e) => {
                    // Handle link clicks
                    const target = e.target as HTMLElement
                    if (target.tagName === 'A') {
                        e.stopPropagation() // Prevent parent click events
                    }
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
                .rich-note-content a {
                    word-break: break-all;
                    text-decoration: underline;
                    color: #2563eb;
                    transition: color 0.2s;
                }
                .rich-note-content a:hover {
                    color: #1d4ed8;
                }
                @media (prefers-color-scheme: dark) {
                    .rich-note-content a {
                        color: #60a5fa;
                    }
                    .rich-note-content a:hover {
                        color: #93c5fd;
                    }
                }
            `}</style>
        </>
    )
}