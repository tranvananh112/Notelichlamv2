"use client"

import { useEffect, useRef, useState } from "react"

interface VideoBannerProps {
    videoSrc: string
    height?: number
    className?: string
}

export default function VideoBanner({
    videoSrc,
    height = 200,
    className = ""
}: VideoBannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.play().catch(err => {
                console.log("Autoplay prevented:", err)
            })
        }
    }, [])

    return (
        <div
            className={`relative w-full overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 ${className}`}
            style={{ height: `${height}px` }}
        >
            {/* Video Background */}
            <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsLoaded(true)}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Loading Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white text-sm font-medium">Đang tải...</p>
                    </div>
                </div>
            )}

            {/* Decorative Overlay (optional) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
        </div>
    )
}