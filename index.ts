import { Property, Stream } from 'kefir'
import { useEffect, useState } from 'react'

export function useStream<T>(streamGen: () => Property<T, unknown>, deps?: any[]): T
export function useStream<T>(streamGen: () => Stream<T, unknown>, deps: any[] = []): T | undefined {
    let initial: T | undefined = undefined
    const setInitial = (v: T) => initial = v
    const stream = streamGen()
    const initial$ = stream.take(1)
    initial$.onValue(setInitial)

    let [value, setValue] = useState<T | undefined>(initial)

    initial$.offValue(setInitial)

    useEffect(() => {
        const stream = streamGen()
        return stream.observe(setValue).unsubscribe
    }, deps)

    return value
}
