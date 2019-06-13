# react-kefir-hook
Simple hook that allows to use kefir.js streams and properties in react components

[Kefir.js](https://kefirjs.github.io/kefir/) is a reactive framework with very high performance.
 

# Usage
Hook's callback must return a kefir `Stream` or `Property`

If you use a `Stream`, returned value will always by `undefined` until a stream emits any value 
```
// valueFromStream will initially be `undefined`, later it will contain values that the stream emits
const valueFromStream = useStream(() => myStream)
```

If you use a `Property`, returned value will always contain a value 
```
// valueFromProperty will contain current value as well as next values emitted by the property
const valueFromProperty = useStream(() => myProperty)
```


# Stream dependencies
Hook uses dependencies exactly like `useEffect` does, as a second parameter

Usage without dependencies. 

Stream will be fetched once per component mount.
```
import { useStream } from 'react-kefir-hook'

const SmallServerStatusButton = () => {
    
    // connectionState$ is a kefir stream or property
    const connectionStatus = useStream(() => connectionState$)

    return <div>
        {connectionStatus ? <h1>connected</h1> : <h1>diconnected</h1>}
    </div>
}
```

Usage with dependencies.

Stream will be fetched whenever dependencies change.
```
import { useStream } from 'react-kefir-hook'

const SmallServerStatusButton = () => {
    
    const userData = useStream(() => getUserDataStream(userId), [userId])

    return <div>
        {userData ? <h1>{userData.name}</h1> : <h1>{loading...}</h1>}
    </div>
}
```

# Initial data

If you return a `Property`, you will always get a initial result.

```
import { constant, later } from 'kefir'
import { useStream } from 'react-kefir-hook'

const SmallServerStatusButton = () => {
    
    const helloProperty = useStream(() => constant('hello'))
    const helloStream = useStream(() => later(1000, 'hello'))

    return <div>
        <div>Prop: {helloProperty}</div>
        <div>Stream: {helloStream}</div>
    </div>
}
```

You will see two renders:

First:
```
Prop: hello
Stream: 
```

Second, about a secong later, when `later(1000, 'hello')` emits a value:

```
Prop: hello
Stream: hello 
```
---
You may supply initial value by converting `Stream` to `Property` (kefir.js territory)
```
import { constant, later } from 'kefir'
import { useStream } from 'react-kefir-hook'

const SmallServerStatusButton = () => {
    
    const helloProperty = useStream(() => constant('hello'))
    const helloStream = useStream(() => later(1000, 'hello').toProperty(() => 'I will hello later'))

    return <div>
        <div>Prop: {helloProperty}</div>
        <div>Stream: {helloStream}</div>
    </div>
}
```

You will see two renders:

First:
```
Prop: hello
Stream: I will hello later
```

Second, about a secong later, when `later(1000, 'hello')` emits a value:

```
Prop: hello
Stream: hello 
```
