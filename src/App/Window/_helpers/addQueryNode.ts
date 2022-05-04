import { nanoid } from 'nanoid'
import type ComposedQueryType from '../../../_types/ComposedQueryType'
import type QueryNodeType from '../../../_types/QueryNodeType'
import type QueryNodeAdditionType from '../_types/QueryNodeAdditionType'

const addQueryNode = (
  state: ComposedQueryType,
  { content, operation, at }: QueryNodeAdditionType
): ComposedQueryType => {
  const currX = at === undefined ? state.length : at

  let newNode: QueryNodeType = {
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

export default addQueryNode
