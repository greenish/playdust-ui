const ALL_FIELDS = [
  'name',
  'relevance',
  'list-price',
  'sale-price',
  'rarity-score',
] as const
type SortTuple = typeof ALL_FIELDS
type SortField = SortTuple[number]

const ALL_DIRECTIONS = ['asc', 'desc'] as const
type DirectionTuple = typeof ALL_DIRECTIONS
type SortDirection = DirectionTuple[number]

interface SearchSort {
  field: SortField
  direction: SortDirection
}

export const isSearchSort = (value: SearchSort): value is SearchSort => {
  return (
    ALL_FIELDS.includes(value.field as SortField) &&
    ALL_DIRECTIONS.includes(value.direction as SortDirection)
  )
}

export default SearchSort
