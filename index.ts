import { Event, Observable, Property } from 'kefir'
import { useEffect, useMemo, useState } from 'react'

function setError(e: any) {
    console.error('useStream got error:', e)
}

export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue: T, deps?: any[]): T
export function useStream<T>(streamGen: () => Property<T, unknown>, initialValue?: undefined, deps?: any[]): T
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: undefined, deps?: any[]): T | undefined
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: T, deps: any[] = []): T | undefined {
    const stream = useMemo(streamGen, deps)

    let [value, setValue] = useState<T | undefined>(() => {
        if ('_setActive' in stream) {
            const streamPorcelain = (<any>stream)
            streamPorcelain._setActive(true)
            const currentEvent = (<Event<any, any>>(streamPorcelain._currentEvent))
            if (currentEvent && currentEvent.type === 'value') {
                return currentEvent.value
            }
        }
    })

    useEffect(() => {
        return stream.observe(setValue, setError).unsubscribe
    }, deps)

    return value
}
