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

Kefir stream will be activated when the `useStream` is used.
If the stream returns the value synchronously (Property with an initialValue or an already active Property),
the value will be used as a return from `useStream`.

If provided stream will not return a value upon activation, an `undefined` or `initialValue` (3th argument for `useStream`) will be returned initially and 
component will rerender and a new value will be returned whenever the stream emits.

```
import { constant, later } from 'kefir'
import { useStream } from 'react-kefir-hook'

const SmallServerStatusButton = () => {
    
    const helloProperty = useStream(() => constant('hello'))
    const helloStream = useStream(() => later(1000, 'hello'))
    const helloStreamWithInitial = useStream(() => later(1000, 'hello'),undefined,'I am initial')

    return <div>
        <div>Prop: {helloProperty}</div>
        <div>Stream: {helloStream}</div>
        <div>Stream with initial: {helloStreamWithInitial}</div>
    </div>
}
```

You will see two renders:

First:
```
Prop: hello
Stream: 
Stream with initial: I am initial
```

Then, about a second later, when `later(1000, 'hello')` emits a value:

```
Prop: hello
Stream: hello 
Stream with initial: hello
```
