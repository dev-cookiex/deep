# CX. Deep.
[![npm version](https://img.shields.io/badge/npm-v0.0.2-blueviolet?style=for-the-badge)](https://www.npmjs.com/package/@cookiex/deep)

Deep is a library for joining object into one using immutability.

----------

## Install

```
yarn add @cookiex/deep
```
or
```
npm install --save @cookiex/deep
```

----------

## Usage

### Easy merge objects.

```ts
import deep from '@cookiex/deep'

const fakeTarget = { a: 1, b: 2, c: { d: 4, e: 5 } }

const merged = deep( fakeTarget, { f: 6, a: 2, c: { g: 7 } } )
// => { a: 2, b: 2, c: { d: 4, e: 5, g: 7 } }
fakeTarget
// => { a: 1, b: 2, c: { d: 4, e: 5 } }
deep( merged, { a: '1' } )
// => throw TypeConflictError
```

### Merge using target object

```ts
import deep from '@cookiex/deep'

const target = { a: 1, b: 2, c: { d: 4, e: 5 } }

const merged = deep.assing( target, { f: 6, a: 2, c: { g: 7 } } )

merged // => { a: 2, b: 2, c: { d: 4, e: 5, g: 7 } }
target // => { a: 2, b: 2, c: { d: 4, e: 5, g: 7 } }
```

### Create merger function

```ts
import { create } from '@cookiex/deep'

const deep = create() // return same of deep
const concatArray = create( {
  typeResolveArray: 'concat' // default is overwrite
} )
concatArray(
  { items: [ 1, 2, { number: 3 } ] },
  { items: [ 4, { number: 5 } ] },
  { items: [ { number: 6 }, 7 ] }
)
// => { items: [ 1, 2, { nubmer: 3 }, 4, { number: 5 }, { number: 6 } ] }

const ignoreConflict = create( {
  ignoreConflictType: true
} )

ignoreConflict( { age: '12' }, { age: 21 } )
// => { age: 21 }

const sliceArray = create( {
  typeResolveArray: 'slice'
} )

sliceArray(
  { items: [ 1, { number: 2 } ] },
  { items: [ 3 ] }
)
// => { items: [ 3, { number: 2 } ] }
```

### Slice array deep
```ts
import deep from '@cookiex/deep'

const sliceDeepArray = create( {
  typeResolveArray: 'slice-deep',
  ignoreConflictType: true
} )

sliceDeepArray(
  { items: [ 1, { number: 2 } ] },
  { items: [ { number: 1, radix: 10 }, { radix: 10 } ] }
)
// => { items: [ { number: 1, radix: 10 }, { number: 2, radix: 10 } ] }
```

### Complete Merger Builder

```ts
import deep from '@cookiex/deep'

const mergerBuilderFunction: deep.MergerReducerBuilderMap = (
  key: string | number | symbol,
  grouped: any,
  object: any,
  map: MergerReducerBuilderMap
): any => {
  // Logical calc to return value for key
  return null
}

const merger = deep.mergerBuilder( mergerBuilderFunction )

merger( { a: 1, b: 2, c: { d: 3 } } )
// => { a: null, b: null, c: null }
```
