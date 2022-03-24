import ComposedQueryType, {
  AttributeQuery,
} from '../../types/ComposedQueryType'
import { AttributeResponse } from '../../types/SearchResponse'
import getAttributeAggQuery from './getAttributeAggQuery'
import getNFTQuery from './getNFTQuery'

export const getAllAttributeQueries = (
  query: ComposedQueryType,
  nftQuery: object
) => {
  const exactAttributeQueries = query.flatMap((parent) =>
    parent.filter((child) => {
      if ('trait' in child && child.field === 'attribute') {
        return true
      }

      return false
    })
  ) as AttributeQuery[]

  const modifiedQueries = exactAttributeQueries.map((entry) => {
    const withoutValue = query.map((parent) =>
      parent.map((child) => {
        if (child.id === entry.id) {
          return {
            ...child,
            value: undefined,
          }
        }

        return child
      })
    )

    return getNFTQuery(withoutValue as ComposedQueryType, 0)
  })

  const attributeQueries = [nftQuery, ...modifiedQueries].map((entry) => ({
    ...entry,
    ...getAttributeAggQuery(),
  }))

  return {
    attributeQueries,
    cleanAttributes: (attributeResults: any[]) => {
      const [base, ...results]: AttributeResponse[] = attributeResults.map(
        (data) =>
          data.aggregations.name.trait.buckets.map((entry: any) => ({
            trait: entry.key,
            options: entry.value.buckets.map((y: any) => y.key).filter(Boolean),
          }))
      )

      const normalizedAggs = exactAttributeQueries.reduce((acc, curr, idx) => {
        const result = results[idx]
        const found = result.find((entry) => entry.trait === curr.trait)
        const filtered = acc.filter((entry) => entry.trait !== found?.trait)

        if (found) {
          const sorted = [
            ...filtered.slice(0, idx),
            found,
            ...filtered.slice(idx),
          ]

          return sorted
        }

        return acc
      }, base)

      return normalizedAggs
    },
  }
}
