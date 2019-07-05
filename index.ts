import { Event, Observable } from 'kefir'
import { useEffect, useMemo, useState } from 'react'

export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue: T, deps?: any[]): T
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: undefined, deps?: any[]): T | undefined
export function useStream<T>(streamGen: () => Observable<T, unknown>, initialValue?: T, deps: any[] = []): T | undefined {
    const stream = useMemo(streamGen, deps)

    if ('_setActive' in stream) {
        (<any>stream)._setActive(true)
        const currentEvent = (<Event<any, any>>((<any>stream)._currentEvent))
        if (currentEvent && currentEvent.type === 'value') {
            initialValue = currentEvent.value
        }
    }

    let [value, setValue] = useState<T | undefined>(initialValue)

    useEffect(() => {
        return stream.observe(setValue).unsubscribe
    }, deps)

    return value
}
