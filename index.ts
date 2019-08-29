import { Event, Observable } from 'kefir'
import { useEffect, useMemo, useState } from 'react'

export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue: T, deps?: any[]): T
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: undefined, deps?: any[]): T | undefined
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: T, deps: any[] = []): T | undefined {
    const stream = useMemo(streamGen, deps)

    let hasInitial = false
    if ('_setActive' in stream) {
        const streamPorcelain = (<any>stream)
        streamPorcelain._setActive(true)
        const currentEvent = (<Event<any, any>>(streamPorcelain._currentEvent))
        if (currentEvent && currentEvent.type === 'value') {
            hasInitial = true
            initialValue = currentEvent.value
        }
    }

    let [value, setValue] = useState<T | undefined>(initialValue)

    const setError = (e: any) => {
        console.error('useStream got error:', e)
    }

    useEffect(() => {
        return (hasInitial
                ? stream.skip(1)
                : stream
        ).observe(setValue, setError).unsubscribe
    }, deps)

    return value
}
