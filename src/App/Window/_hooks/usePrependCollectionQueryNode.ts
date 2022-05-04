import { nanoid } from 'nanoid'
import type ComposedQueryType from '../../../_types/ComposedQueryType'
import type QueryNodeType from '../../../_types/QueryNodeType'
import makeUseQueryChange from '../_helpers/makeUseQueryChange'

const isRange = (parent: QueryNodeType[]) =>
  parent.length === 1 && parent[0].field === 'range'

const usePrependCollectionQueryNode = makeUseQueryChange<string>(
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

export default usePrependCollectionQueryNode
