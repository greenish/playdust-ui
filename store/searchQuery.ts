import { nanoid } from 'nanoid'
import { atom, useRecoilState } from 'recoil'

export type FieldType = 'collection' | 'attribute'
export type SearchType = 'exact' | 'relevance'

export type QueryType = {
  id: string
  field: FieldType
  searchType: SearchType
  trait?: string
  value?: string | string[]
  isMulti?: boolean
  relevance?: number
}

export type ComposedQueryType = QueryType[][]

const searchQuery = atom<ComposedQueryType>({
  key: 'searchQuery',
  default: [
    [
      {
        id: nanoid(),
        field: 'collection',
        searchType: 'exact',
      },
    ],
  ],
})

export const useAddChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (
    currX: number,
    operation: 'and' | 'or',
    searchType: SearchType,
    field: FieldType
  ) => {
    const newNode: QueryType = {
      id: nanoid(),
      field,
      searchType,
    }

    if (operation === 'or') {
      const nextState: ComposedQueryType = state.map((entry, idx) => {
        if (idx === currX) {
          return [...entry, newNode]
        }

        return entry
      })

      return setter(nextState)
    }

    const nextState = [
      ...state.slice(0, currX + 1),
      [newNode],
      ...state.slice(currX + 1),
    ]

    setter(nextState)
  }
}

export const useRemoveChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (id: string) => {
    const nextState = state
      .map((parent) => parent.filter((child) => child.id !== id))
      .filter((parent) => parent.length > 0)

    setter(nextState)
  }
}

export const useUpdateChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (id: string, update: Partial<QueryType>) => {
    const nextState = state.map((parent) =>
      parent.map((child) => {
        if (child.id === id) {
          return {
            ...child,
            ...update,
          }
        }

        return child
      })
    )

    setter(nextState)
  }
}

export default searchQuery
