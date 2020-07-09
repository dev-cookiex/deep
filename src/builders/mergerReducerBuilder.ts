import extractKeysAndSymbols from '../tools/extractKeysAndSymbols'
import { MergerReducerBuilderMap } from '../types'
import mergerReducerMiddlewareBuilder from './mergerReducerMiddlewareBuilder'

const mergerReducerBuilder = ( map: MergerReducerBuilderMap ) =>
  ( grouped: any, object: any ) =>
    extractKeysAndSymbols( object )
      .reduce( mergerReducerMiddlewareBuilder( map, object ), grouped )

export default mergerReducerBuilder
