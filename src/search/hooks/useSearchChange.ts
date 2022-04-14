import { nanoid } from 'nanoid'
import { useRecoilValue } from 'recoil'
import { usePushWindowHash } from '../../app/helpers/getWindowUrl'
import serializeSearch from '../helpers/serializeSearch'
import * as store from '../store'
import ComposedQueryType, {
  AttributeContent,
  OperationType,
  QueryContent,
  QueryType,
  RangeContent,
} from '../types/ComposedQueryType'
import type SearchSort from '../types/SearchSort'
import type SearchState from '../types/SearchState'
import useUpdateSearch from './useUpdateSearch'

interface QueryAddition {
  content: QueryContent
  operation: OperationType
  at?: number
}

const addNode = (
  state: ComposedQueryType,
  { content, operation, at }: QueryAddition
): ComposedQueryType => {
  const currX = at === undefined ? state.length : at

  let newNode: QueryType = {
    id: nanoid(),
    ...content,
  }

  if (operation === 'or') {
    const nextQuery: ComposedQueryType = state.map((entry, idx) => {
      if (idx === currX) {
        return [...entry, newNode]
      }

      return entry
    })

    return nextQuery
  }

  const nextQuery = [
    ...state.slice(0, currX + 1),
    [newNode],
    ...state.slice(currX + 1),
  ]

  return nextQuery
}

const updateNode = (
  state: ComposedQueryType,
  id: string,
  update: Partial<QueryType>
): ComposedQueryType => {
  const nextQuery = state.map((parent) =>
    parent.map((child) => {
      if (child.id === id) {
        return {
          ...child,
          ...update,
        }
      }

      return child
    })
  ) as ComposedQueryType

  return nextQuery
}

const removeNode = (
  state: ComposedQueryType,
  id: string
): ComposedQueryType => {
  const nextQuery = state
    .map((parent) => parent.filter((child) => child.id !== id))
    .filter((parent) => parent.length > 0)

  return nextQuery
}

export function makeUseSearchChange<T>(
  getHandler: (
    currQuery: ComposedQueryType
  ) => (input: T) => Partial<SearchState>
) {
  return function useSearchChange(method: 'router' | 'memory' = 'router') {
    const pushWindowHash = usePushWindowHash()
    const query = useRecoilValue(store.searchQuery)
    const sort = useRecoilValue(store.searchSort)
    const updateSearch = useUpdateSearch()

    return (input: T) => {
      const nextState = getHandler(query)(input)

      const next: SearchState = {
        query: nextState.query || query,
        sort: nextState.sort || sort,
        onlyListed: nextState.onlyListed,
      }

      if (method === 'router') {
        const serialized = serializeSearch(next)

        return pushWindowHash({ type: 'search', state: serialized })
      }

      updateSearch(next)
    }
  }
}

export const useRemoveNode = makeUseSearchChange<string>(
  (query) => (id: string) => {
    const nextQuery = removeNode(query, id)

    return { query: nextQuery }
  }
)

export const useAddTextNode = makeUseSearchChange<string>((query) => (text) => {
  const queryAddition: QueryAddition = {
    content: {
      field: 'text',
      value: text,
    },
    operation: 'and',
  }
  const sort: SearchSort = {
    field: 'relevance',
    direction: 'desc',
  }

  const nextQuery = addNode(query, queryAddition)

  return { query: nextQuery, sort }
})

interface UseUpdateTextNodeInput {
  id: string
  text: string
}

export const useUpdateTextNode = makeUseSearchChange<UseUpdateTextNodeInput>(
  (query) =>
    ({ text, id }) => {
      const nextQuery = updateNode(query, id, { value: text })

      return { query: nextQuery }
    }
)

interface UseAddAttributeNodeInput {
  value: string[]
  trait: string
  operation: OperationType
  at?: number
}

export const useAddAttributeNode =
  makeUseSearchChange<UseAddAttributeNodeInput>(
    (query) =>
      ({ value, trait, operation, at }) => {
        const queryAddition: QueryAddition = {
          content: {
            field: 'attribute',
            value,
            trait,
          },
          operation,
          at,
        }

        const next = addNode(query, queryAddition)

        return { query: next }
      }
  )

interface UseUpdateAttributeNodeInput {
  id: string
  update: Partial<AttributeContent>
  clearOnEmpty?: boolean
}

export const useUpdateAttributeNode =
  makeUseSearchChange<UseUpdateAttributeNodeInput>(
    (query) =>
      ({ id, update, clearOnEmpty }) => {
        if (
          clearOnEmpty &&
          update.value !== undefined &&
          update.value.length === 0
        ) {
          const next = removeNode(query, id)

          return { query: next }
        }

        const next = updateNode(query, id, update)

        return { query: next }
      }
  )

export const useAddRangeNode = makeUseSearchChange<Omit<RangeContent, 'field'>>(
  (query) => (value) => {
    const queryAddition: QueryAddition = {
      content: {
        field: 'range',
        ...value,
      },
      operation: 'and',
      at: -1,
    }

    const next = addNode(query, queryAddition)

    return { query: next }
  }
)

interface UseUpdateRangeNodeInput {
  id: string
  update: Partial<RangeContent>
}

export const useUpdateRangeNode = makeUseSearchChange<UseUpdateRangeNodeInput>(
  (query) =>
    ({ id, update }) => {
      const next = updateNode(query, id, update)

      return { query: next }
    }
)

interface UseAddCollectionNode {
  collectionId: string
  operation?: OperationType
  at?: number
}

export const useAddCollectionNode = makeUseSearchChange<UseAddCollectionNode>(
  (query) =>
    ({ collectionId, operation, at }) => {
      const queryAddition: QueryAddition = {
        content: {
          field: 'collection',
          value: collectionId,
        },
        operation: operation || 'and',
        at,
      }

      const next = addNode(query, queryAddition)

      return { query: next }
    }
)

export const useInitCollectionQuery = makeUseSearchChange<string>(
  () => (collectionId: string) => {
    const next: ComposedQueryType = [
      [
        {
          field: 'collection',
          value: collectionId,
          id: nanoid(),
        },
      ],
    ]

    return { query: next }
  }
)

const isRange = (parent: QueryType[]) =>
  parent.length === 1 && parent[0].field === 'range'

export const usePrependCollectionNode = makeUseSearchChange<string>(
  (query) => (collectionId: string) => {
    const next: ComposedQueryType = [
      ...query.filter(isRange),
      [
        {
          id: nanoid(),
          field: 'collection',
          value: collectionId,
        },
      ],
      ...query.filter((parent) => !isRange(parent)),
    ]

    return { query: next }
  }
)

export const useSetSortValue = makeUseSearchChange<SearchSort>(
  () => (nextSort) => {
    if (nextSort.field === 'list-price') {
      return { sort: nextSort, onlyListed: true }
    }

    return { sort: nextSort }
  }
)

export const useSetOnlyListed = makeUseSearchChange<boolean>(
  () => (nextOnlyListed) => {
    return { onlyListed: nextOnlyListed }
  }
)
