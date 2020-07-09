namespace Types {
  export interface Merger {
    <A>( a: A ): A
    <A, B>( a: A, b: B ): A & B
    <A, B, C>( a: A, b: B, c: C ): A & B & C
    <A, B, C, D>( a: A, b: B, c: C, d: D ): A & B & C & D
    <A, B, C, D, E>( a: A, b: B, c: C, d: D, e: E ): A & B & C & D & E
    <A, B, C, D, E, F>( a: A, b: B, c: C, d: D, e: E, f: F ): A & B & C & D & E & F
    <R = any>( ...args: [ any, ...any[] ] ): R
  }
  export type MergerReducerBuilderMap =
    ( key: string | symbol | number, grouped: any, object: any, map: MergerReducerBuilderMap ) => any
}

export = Types
