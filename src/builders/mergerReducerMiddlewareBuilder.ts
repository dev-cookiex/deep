import { MergerReducerBuilderMap } from '../types'

const mergerReducerMiddlewareBuilder = ( map: MergerReducerBuilderMap, object: any ) =>
  ( target: any, key: string | symbol ) => ( { ...target, [key]: map( key, target, object, map ) } )

export default mergerReducerMiddlewareBuilder
