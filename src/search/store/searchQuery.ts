import { nanoid } from 'nanoid'
import {
  atom,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil'
import ComposedQueryType, {
  AttributeContent,
  OperationType,
  QueryContent,
  QueryType,
} from '../types/ComposedQueryType'
import { queryValidationPredicate, searchQueryValid } from './'

export const searchQuery = atom<ComposedQueryType>({
  key: 'searchQuery',
  default: [],
})

export const useInitializeCollectionQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  return (value: string) => {
    setter([
      [
        {
          id: nanoid(),
          field: 'collection',
          value,
        },
      ],
    ])
  }
}

export const usePrependCollectionQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  return (value: string) => {
    setter((state) => [
      [
        {
          id: nanoid(),
          field: 'collection',
          value,
        },
      ],
      ...state,
    ])
  }
}

const useAddChild = () => {
  const [state, setter] = useRecoilState(searchQuery)

  return (content: QueryContent, operation: OperationType, at?: number) => {
    const currX = at === undefined ? state.length : at

    const newNode: QueryType = {
      id: nanoid(),
      ...content,
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

export const useAddCollection = () => {
  const addChild = useAddChild()

  return (value: string, operation: OperationType, at?: number) => {
    addChild(
      {
        field: 'collection',
        value,
      },
      operation,
      at
    )
  }
}

export const useAddAttribute = () => {
  const addChild = useAddChild()

  return (
    value: string[],
    trait: string,
    operation: OperationType,
    at?: number
  ) => {
    addChild(
      {
        field: 'attribute',
        value,
        trait,
      },
      operation,
      at
    )
  }
}

export const useAddText = () => {
  const addChild = useAddChild()

  return (value: string, operation: OperationType, at?: number) => {
    addChild(
      {
        field: 'text',
        value,
      },
      operation,
      at
    )
  }
}

export const useUpdateAttribute = () => {
  const updateChild = useUpdateChild()
  const removeChild = useRemoveChild()

  return (
    id: string,
    update: Partial<AttributeContent>,
    clearOnEmpty = false
  ) => {
    if (
      clearOnEmpty &&
      update.value !== undefined &&
      update.value.length === 0
    ) {
      return removeChild(id)
    }

    updateChild(id, update)
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

    setter(nextState as ComposedQueryType)
  }
}

export const useClearSearchQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  return () => {
    setter((state) =>
      state
        .map((parent) => parent.filter((child) => child.locked))
        .filter((parent) => parent.length > 0)
    )
  }
}

export const useSetSearchQueryValid = () => {
  const setter = useSetRecoilState(searchQuery)

  const callback = useRecoilCallback(({ snapshot }) => async () => {
    const valid = await snapshot.getPromise(searchQueryValid)

    setter(valid)
  })

  return callback
}

export const useBootstrapSearchQuery = () => {
  const setter = useSetRecoilState(searchQuery)

  const callback = (payload: any) => {
    try {
      const parsedQuery = payload as any[][]
      const withIds = parsedQuery.map((parent) =>
        parent.map((child) => ({
          id: nanoid(),
          ...child,
        }))
      )
      const isValid = withIds.flat().every(queryValidationPredicate)

      if (!isValid) {
        throw new Error()
      }

      setter(withIds)
    } catch (e) {
      console.error('unable to bootstrap search query:', e)
    }
  }

  return callback
}
