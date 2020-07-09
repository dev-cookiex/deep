const extractKeysAndSymbols = ( object: any ) =>
  [ ...Object.keys( object ), ...Object.getOwnPropertySymbols( object ) ]

export default extractKeysAndSymbols
