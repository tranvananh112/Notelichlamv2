import { useState, useCallback, useRef, useMemo } from 'react'

// Optimized state management with batching and memoization
export function useOptimizedState<T>(initialValue: T) {
    const [state, setState] = useState<T>(initialValue)
    const pendingUpdates = useRef<Array<(prev: T) => T>>([])
    const batchTimeout = useRef<NodeJS.Timeout | null>(null)

    const batchedSetState = useCallback((updater: (prev: T) => T) => {
        pendingUpdates.current.push(updater)

        if (batchTimeout.current) {
            clearTimeout(batchTimeout.current)
        }

        batchTimeout.current = setTimeout(() => {
            setState(prev => {
                let result = prev
                for (const update of pendingUpdates.current) {
                    result = update(result)
                }
                pendingUpdates.current = []
                return result
            })
            batchTimeout.current = null
        }, 0)
    }, [])

    const optimizedSetState = useCallback((value: T | ((prev: T) => T)) => {
        if (typeof value === 'function') {
            batchedSetState(value as (prev: T) => T)
        } else {
            batchedSetState(() => value)
        }
    }, [batchedSetState])

    return [state, optimizedSetState] as const
}

// Optimized array state with efficient operations
export function useOptimizedArray<T>(initialArray: T[] = []) {
    const [items, setItems] = useOptimizedState<T[]>(initialArray)

    const operations = useMemo(() => ({
        add: (item: T) => setItems(prev => [...prev, item]),

        addMultiple: (newItems: T[]) => setItems(prev => [...prev, ...newItems]),

        remove: (predicate: (item: T) => boolean) =>
            setItems(prev => prev.filter(item => !predicate(item))),

        update: (predicate: (item: T) => boolean, updater: (item: T) => T) =>
            setItems(prev => prev.map(item => predicate(item) ? updater(item) : item)),

        replace: (newItems: T[]) => setItems(newItems),

        clear: () => setItems([]),

        move: (fromIndex: number, toIndex: number) => setItems(prev => {
            const result = [...prev]
            const [removed] = result.splice(fromIndex, 1)
            result.splice(toIndex, 0, removed)
            return result
        })
    }), [setItems])

    return [items, operations] as const
}

// Optimized object state with deep updates
export function useOptimizedObject<T extends Record<string, any>>(initialObject: T) {
    const [obj, setObj] = useOptimizedState<T>(initialObject)

    const operations = useMemo(() => ({
        update: (key: keyof T, value: T[keyof T]) =>
            setObj(prev => ({ ...prev, [key]: value })),

        updateMultiple: (updates: Partial<T>) =>
            setObj(prev => ({ ...prev, ...updates })),

        updateNested: (path: string, value: any) =>
            setObj(prev => {
                const keys = path.split('.')
                const result = { ...prev }
                let current: any = result

                for (let i = 0; i < keys.length - 1; i++) {
                    current[keys[i]] = { ...current[keys[i]] }
                    current = current[keys[i]]
                }

                current[keys[keys.length - 1]] = value
                return result
            }),

        remove: (key: keyof T) =>
            setObj(prev => {
                const { [key]: removed, ...rest } = prev
                return rest as T
            }),

        reset: () => setObj(initialObject)
    }), [setObj, initialObject])

    return [obj, operations] as const
}

// Optimized form state management
export function useOptimizedForm<T extends Record<string, any>>(
    initialValues: T,
    validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) {
    const [values, valueOperations] = useOptimizedObject(initialValues)
    const [errors, setErrors] = useOptimizedState<Partial<Record<keyof T, string>>>({})
    const [touched, setTouched] = useOptimizedState<Partial<Record<keyof T, boolean>>>({})

    const validate = useCallback((field?: keyof T) => {
        if (!validationRules) return true

        const fieldsToValidate = field ? [field] : Object.keys(validationRules) as (keyof T)[]
        const newErrors: Partial<Record<keyof T, string>> = {}
        let isValid = true

        for (const fieldName of fieldsToValidate) {
            const rule = validationRules[fieldName]
            if (rule) {
                const error = rule(values[fieldName])
                if (error) {
                    newErrors[fieldName] = error
                    isValid = false
                }
            }
        }

        setErrors(prev => ({ ...prev, ...newErrors }))
        return isValid
    }, [values, validationRules])

    const setValue = useCallback((field: keyof T, value: T[keyof T]) => {
        valueOperations.update(field, value)
        if (touched[field]) {
            validate(field)
        }
    }, [valueOperations, touched, validate])

    const setTouchedField = useCallback((field: keyof T) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validate(field)
    }, [validate])

    const reset = useCallback(() => {
        valueOperations.reset()
        setErrors({})
        setTouched({})
    }, [valueOperations])

    const isValid = useMemo(() => {
        return Object.keys(errors).length === 0
    }, [errors])

    return {
        values,
        errors,
        touched,
        isValid,
        setValue,
        setTouchedField,
        validate,
        reset
    }
}