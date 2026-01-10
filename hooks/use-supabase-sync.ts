import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseSyncOptions {
    onError?: (error: Error) => void
    onSuccess?: () => void
}

export function useSupabaseSync(options: UseSyncOptions = {}) {
    const [status, setStatus] = useState<SyncStatus>('idle')
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const supabase = createClient()

    const syncData = useCallback(async (
        operation: () => Promise<any>,
        fallback?: () => void
    ) => {
        setStatus('saving')

        try {
            await operation()
            setStatus('saved')
            setLastSaved(new Date())
            options.onSuccess?.()
        } catch (error) {
            console.error('Sync error:', error)
            setStatus('error')
            fallback?.()
            options.onError?.(error as Error)
        }
    }, [options])

    const resetStatus = useCallback(() => {
        setStatus('idle')
    }, [])

    return {
        status,
        lastSaved,
        syncData,
        resetStatus,
        supabase
    }
}