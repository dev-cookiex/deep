class DeepConflictError extends Error {
  public static assert( left: any, right: any ) {
    if ( typeof left !== typeof right ) throw new this( left, right )
  }
  constructor( left: any, right: any ) {
    super( `type conflict with ${Array.isArray( right ) ? 'array' : typeof right} try to use ${Array.isArray( left ) ? 'array' : typeof left}` )
  }
}
const mergeWithoutTarget: deep.Merger = ( ...args: any[] ) => target( {}, ...args )

const extractKeys = ( object: object ) => {
  const keys = Object.keys( object )
  const simbols = Object.getOwnPropertySymbols( object )

  return [ ...keys, ...simbols ]
}
const mergeInTargetMap = (
  map: ( key: string | symbol, target: any, object: any, merge: ( target: any, object: any ) => any ) => void
) => {
  const merge = ( target: any, object: any ) => {
    extractKeys( object ).forEach( key => {
      if ( target[key] === undefined || target[key] === null ) return target[key] = object[key]

      if ( object[key] === undefined ) return void 0

      if (
        typeof object[key] === 'object' &&
        typeof target[key] === 'object' &&
        !object[key].prototype &&
        !target[key].prototype &&
        !Array.isArray( object[key] ) &&
        !Array.isArray( target[key] )
      ) return target[key] = merge( target[key], object[key] )

      map( key, target, object, merge )
    } )
    return target
  }
  return merge
}

const create: deep.Create = ( config: Partial<deep.Create.Config> ): deep.Merger => {
  const realConfig = Object.assign( {}, create.defaultConfig, config )
  const merge = mergeInTargetMap( ( key, target, object, merge ) => {
    if (
      !realConfig.ignoreTypeConflict &&
      object[key] !== undefined &&
      object[key] !== null &&
      typeof target[key] !== typeof object[key]
    ) throw new DeepConflictError( target[key], object[key] )

    const arrayResolve = ( a: any[], b: any[] ) => {
      let array: any[] = []
      switch ( realConfig.resolveArrayType ) {
        case 'overwrite': return array = b
        case 'concat': return array = a.concat( b )
        case 'slice': return array = a.slice( 0, a.length - b.length ).concat( b )
        case 'slice-deep':
          const max = Math.max( a.length, b.length )
          for( let i = 0; i < max; i++ )
            if ( a[i] === undefined || a[i] === null ) array[i] = b[i]
            else if ( b[i] === undefined || b[i] === null ) array[i] = a[i]
            else if ( !realConfig.ignoreTypeConflict && typeof b[i] !== typeof a[i] )
              throw new DeepConflictError( a[i], b[i] )
            else if ( typeof b[i] === 'object' )
              if ( Array.isArray( b[i] ) )
                if ( Array.isArray( a[i] ) ) array[i] = arrayResolve( a[i], b[i] )
                else throw new DeepConflictError( a[i], b[i] )
              else array[i] = merge( a[i], b[i] )

            else array[i] = b[i]
          return array
        default: throw new Error( 'invalid array resolve' );
      }
    }

    if ( Array.isArray( target[key] ) && Array.isArray( object[key] ) )
      return target[key] = arrayResolve( target[key], object[key] )

    target[key] = object[key] ?? target[key]
  } )
  if ( realConfig.attachInTarget ) return ( ...args: any[] ) => args.reduce( merge )
  return ( ...args: any[] ) => args.reduce( merge, {} )
}

create.defaultConfig = {
  attachInTarget: false,
  resolveArrayType: 'overwrite',
  ignoreTypeConflict: false,
}

const target: deep.Merger = ( target: any, ...args: any[] ) =>
  [ target, ...args ].reduce( ( target, object ) => {
    ( Object.keys( object ) as ( string | symbol )[] ).concat( Object.getOwnPropertySymbols( object ) )
      .forEach( ( key ) => {
        if ( target[key] === undefined || target[key] === null )
          return target[key] = object[key]
        if ( object[key] !== undefined && typeof target[key] !== typeof object[key] )
          throw new Error( '' )

        if ( typeof target[key] === 'object' )
          return target[key] = deep( target[key], object[key] )
        
        target[key] = object[key]
      } )
    return target
  } )

const deep: deep = Object.assign( mergeWithoutTarget, { target, create } )

interface deep extends deep.Merger {
  target: deep.Merger
  create: deep.Create
}

namespace deep {
  export namespace Create {
    export interface Config {
      attachInTarget: boolean
      resolveArrayType: 'overwrite' | 'slice' | 'concat' | 'slice-deep'
      ignoreTypeConflict: boolean
    }
  }
  export interface Create {
    ( config: Partial<Create.Config> ): Merger
    defaultConfig: Create.Config
  }
  export type Partial<T> = {
    [K in keyof T]+?:
      T[K] extends any[] ? T[K] :
      T[K] extends object ? Partial<T[K]> :
      T[K]
  }
  export interface Merger {
    <A>( a: A ): A
    <A, B>( a: A, b: B ): A & B
    <A, B, C>( a: A, b: B, c: C ): A & B & C
    <A, B, C, D>( a: A, b: B, c: C, d: D ): A & B & C & D
    <A, B, C, D, E>( a: A, b: B, c: C, d: D, e: E ): A & B & C & D & E
    <A, B, C, D, E, F>( a: A, b: B, c: C, d: D, e: E, f: F ): A & B & C & D & E & F
    <R = any>( ...args: [ any, ...any[] ] ): R
  }
}

export default deep
