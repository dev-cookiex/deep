export type TypeOf =
    | 'bigint' | 'boolean' | 'function' | 'number'
    | 'object' | 'string' | 'symbol' | 'undefined'

export const doubleIsSameTypeof = ( a: any, b: any ) =>
  typeof a === typeof b

export const doubleTypeof = ( typeOf: TypeOf, a: any, b: any ) =>
  typeof a === typeOf && typeof b === typeOf

export const doubleIsArray = ( a: any, b: any ) => Array.isArray( a ) && Array.isArray( b )

export const doubleIsObject = doubleTypeof.bind( null, 'object' )
