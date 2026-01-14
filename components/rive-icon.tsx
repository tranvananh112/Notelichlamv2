"use client"

import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { useEffect } from 'react'

interface RiveIconProps {
    src: string
    artboard?: string
    stateMachine?: string
    width?: number
    height?: number
    className?: string
    onClick?: () => void
    autoplay?: boolean
}

export default function RiveIcon({
    src,
    artboard,
    stateMachine = "State Machine 1",
    width = 32,
    height = 32,
    className = "",
    onClick,
    autoplay = true
}: RiveIconProps) {
    const { rive, RiveComponent } = useRive({
        src,
        artboard,
        stateMachines: stateMachine,
        autoplay,
    })

    // Trigger hover/click animations
    const hoverInput = useStateMachineInput(rive, stateMachine, "Hover")
    const clickInput = useStateMachineInput(rive, stateMachine, "Click")

    const handleMouseEnter = () => {
        if (hoverInput) {
            hoverInput.value = true
        }
    }

    const handleMouseLeave = () => {
        if (hoverInput) {
            hoverInput.value = false
        }
    }

    const handleClick = () => {
        if (clickInput) {
            clickInput.fire()
        }
        onClick?.()
    }

    return (
        <div
            className={`inline-block cursor-pointer ${className}`}
            style={{ width, height }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <RiveComponent />
        </div>
    )
}