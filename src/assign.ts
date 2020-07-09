import create from './create'
import { Merger } from './types'

const assingMerger: Merger = create()

const assing: Merger = ( target: any, ...args: any[] ) =>
  Object.assign( target, assingMerger( target, ...args ) )

export default assing
