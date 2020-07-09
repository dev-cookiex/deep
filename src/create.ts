import mergerBuilder from './builders/mergerBuilder'
import NotAllowedArrayResolve from './errors/NotAllowedArrayResolve'
import TypeConflictError from './errors/TypeConflictError'
import { doubleIsArray, doubleIsObject } from './tools/doubleChecks'
import { Merger } from './types'

const SAFE_NOT_ALLOC_PROPERTY = Symbol( 'safe-not-alloc-property' )

const create = ( config: Partial<create.Config> = {} ): Merger => {
  const base = Object.assign( {}, create.defaultConfig, config )
  const merger = mergerBuilder( ( key, group, object, map ) => {
    if ( ( group[key] ?? SAFE_NOT_ALLOC_PROPERTY ) === SAFE_NOT_ALLOC_PROPERTY ) return object[key]
    if ( ( object[key] ?? SAFE_NOT_ALLOC_PROPERTY ) === SAFE_NOT_ALLOC_PROPERTY ) return group[key]
  
    if ( !base.ignoreConflictType )
      TypeConflictError.assert( group[key], object[key] )
  
    if ( doubleIsObject( group[key], object[key] ) )
      if ( doubleIsArray( group[key], object[key] ) )
        switch ( base.typeResolveArray ) {
          case 'overwrite': return object[key]
          case 'concat': return [ ...group[key], ...object[key] ]
          case 'slice':
            return group[key].slice( 0, group[key].length - object[key].length ).concat( object[key] )
          case 'slice-deep':
            return Array( Math.max( object[key].length, group[key].length ) )
              .fill( null ).map( ( _, i ) => map( i, group[key], object[key], map ) )
          default: throw new NotAllowedArrayResolve()
        }
      else return merger( group[key], object[key] )
  
    return object[key]
  } )
  return merger
}

create.defaultConfig = {
  ignoreConflictType: false,
  typeResolveArray: 'overwrite'
} as create.Config

namespace create {
  export interface Config {
    ignoreConflictType: boolean
    typeResolveArray: 'overwrite' | 'concat' | 'slice' | 'slice-deep'
  }
}

export default create
