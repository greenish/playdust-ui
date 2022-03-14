import type { NextApiRequest, NextApiResponse } from 'next'
import AttributeResponse from '../types/AttributeResponse'
import ComposedQueryType, { AttributeQuery } from '../types/ComposedQueryType'
import getAttributeAggQuery from './helpers/getAttributeAggQuery'
import getNFTQuery from './helpers/getNFTQuery'
import { postNFTQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<AttributeResponse>
) => {
  const query: ComposedQueryType = req.body

  const esQuery = getNFTQuery(query, 0)
  const aggQuery = getAttributeAggQuery()

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

  const allAggs = await Promise.all(
    [esQuery, ...modifiedQueries].map((entry) =>
      postNFTQuery({
        ...aggQuery,
        ...entry,
      })
    )
  )

  const [base, ...results]: AttributeResponse[] = allAggs.map((data) =>
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
      const sorted = [...filtered.slice(0, idx), found, ...filtered.slice(idx)]

      return sorted
    }

    return acc
  }, base)

  res.json(normalizedAggs)
}

export default handler
