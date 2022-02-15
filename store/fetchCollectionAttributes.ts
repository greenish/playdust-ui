import axios from 'axios'
import { selectorFamily } from 'recoil'

export type CollectionAttribute = {
  trait: string
  options: string[]
}

export type FetchCollectionAggregationOutput = {
  attributes: CollectionAttribute[]
}

const fetchCollectionAttributes = selectorFamily<CollectionAttribute[], string>(
  {
    key: 'fetchCollectionAttributes',
    get: (symbol: string) => async () => {
      const { data } = await axios.get<FetchCollectionAggregationOutput>(
        `/data/${symbol}-AGGREGATION.json`
      )

      return data.attributes
    },
  }
)

export default fetchCollectionAttributes
