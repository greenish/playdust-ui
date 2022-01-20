import { selector } from 'recoil'
import axios from 'axios'
import collectionIdentifier from './collectionIdentifier'

type FetchCollectionAggregationOutput = {
  attributes: {
    trait: string
    options: string[]
  }[]
}

const fetchCollectionAggregation = selector<FetchCollectionAggregationOutput>({
  key: 'fetchCollectionAggregation',
  get: async ({ get }) => {
    const identifier = get(collectionIdentifier)

    if (!identifier) {
      return {
        attributes: []
      }
    }

    const { data } = await axios.get<FetchCollectionAggregationOutput>(
      `/data/${identifier.symbol}-AGGREGATION.json`,
    )

    return data
  },
})

export default fetchCollectionAggregation
