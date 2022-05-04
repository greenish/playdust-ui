import type ComposedQueryType from '../../../_types/ComposedQueryType'
import type QueryNodeType from '../../../_types/QueryNodeType'

const updateQueryNode = (
  state: ComposedQueryType,
  id: string,
  update: Partial<QueryNodeType>
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

export default updateQueryNode
