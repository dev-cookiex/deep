import assing from './assign'
import mergerBuilder from './builders/mergerBuilder'
import mergerReducerBuilder from './builders/mergerReducerBuilder'
import mergerReducerMiddlewareBuilder from './builders/mergerReducerMiddlewareBuilder'
import create from './create'
import NotAllowedArrayResolve from './errors/NotAllowedArrayResolve'
import TypeConflictError from './errors/TypeConflictError'
import Types from './types'

const components = {
  create,
  assing,
  TypeConflictError,
  NotAllowedArrayResolve,
  mergerBuilder,
  mergerReducerBuilder,
  mergerReducerMiddlewareBuilder
}

const deep = Object.assign( create(), components )

namespace deep {
  export interface Merger extends Types.Merger {}
  export interface MergerReducerBuilderMap extends Types.MergerReducerBuilderMap {}
}

export = deep
