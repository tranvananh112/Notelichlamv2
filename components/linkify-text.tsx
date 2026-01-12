"use client"

import React from 'react'

interface LinkifyTextProps {
    text: string
    className?: string
}

// Regex để detect URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g

export default function LinkifyText({ text, className = "" }: LinkifyTextProps) {
    // Function để render text với links
    const renderTextWithLinks = (text: string) => {
        const parts = text.split(URL_REGEX)

        return parts.map((part, index) => {
            // Kiểm tra nếu part là URL
            if (URL_REGEX.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer break-all"
                        onClick={(e) => {
                            e.stopPropagation() // Prevent parent click events
                        }}
                    >
                        {part}
                    </a>
                )
            }

            // Nếu không phải URL, render text bình thường
            return <span key={index}>{part}</span>
        })
    }

    return (
        <span className={className}>
            {renderTextWithLinks(text)}
        </span>
    )
}

// Hook để detect URLs trong text
export function useDetectLinks(text: string) {
    const hasLinks = URL_REGEX.test(text)
    const links = text.match(URL_REGEX) || []

    return {
        hasLinks,
        links,
        linkCount: links.length
    }
}

// Utility function để extract domain từ URL
export function extractDomain(url: string): string {
    try {
        const domain = new URL(url).hostname
        return domain.replace('www.', '')
    } catch {
        return url
    }
}