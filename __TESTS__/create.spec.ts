import deep from '../src'

describe( 'deep create unity tests', () => {
  describe( 'merge with untarget mutation', () => {
    it( 'validate untarget and merged pointer', () => {
      const merger = deep.create()
      const target = { id: 1 }
      const toAdd = { name: 'item' }
      const merged = merger( target, toAdd )

      if ( merged === target ) throw new Error( 'target and merged is same pointer' )
    } )
  } )
  describe( 'merge concat array properties', () => {
    it( 'proposital type conflict error', () => {
      const merger = deep.create( { typeResolveArray: 'concat' } )
      try {
        merger( { string: 'name' }, { string: 123 } )
        throw new Error( 'dont throw in proposital type conflict error' )
      } catch ( e ) {
        expect( e ).toBeInstanceOf( deep.TypeConflictError )
      }
    } )
    it( 'validate concat array', () => {
      const merger = deep.create( { typeResolveArray: 'concat' } )
      const merged = merger(
        { items: [ 'item-1', { name: 'item-2' } ] },
        { items: [ { name: 'item-3' }, 'item-4' ] }
      )
      expect( merged.items.length ).toEqual( 4 )
      expect( merged.items[0] ).toEqual( 'item-1' )
      if ( typeof merged.items[1] !== 'object' )
        throw new Error( 'merged items[1] without respective data' )

      expect( merged.items[1].name ).toEqual( 'item-2' )
      if ( typeof merged.items[2] !== 'object' )
        throw new Error( 'merged items[2] without respective data' )

      expect( merged.items[2].name ).toEqual( 'item-3' )
      expect( merged.items[3] ).toEqual( 'item-4' )
    } )
  } )
} )
