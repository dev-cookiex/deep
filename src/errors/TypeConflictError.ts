import { doubleIsSameTypeof } from '../tools/doubleChecks'

class TypeConflictError extends Error {
  public static assert( left: any, right: any ) {
    if ( !doubleIsSameTypeof( left, right ) ) throw new this( left, right )
    if (
      Array.isArray( left ) && !Array.isArray( right ) 
        ||
      Array.isArray( right ) && !Array.isArray( left ) 
    ) throw new this( left, right )
  }
  constructor( left: any, right: any ) {
    super( `type conflict with ${Array.isArray( right ) ? 'array' : typeof right} try to use ${Array.isArray( left ) ? 'array' : typeof left}` )
  }
}

export default TypeConflictError
