import { MergerReducerBuilderMap, Merger } from '../types'
import mergerReducerBuilder from './mergerReducerBuilder'

const mergerBuilder = ( map: MergerReducerBuilderMap ): Merger => {
  const reducer = mergerReducerBuilder( map )
  return ( ...args: any[] ) => args.reduce( reducer, {} )
}

export default mergerBuilder
