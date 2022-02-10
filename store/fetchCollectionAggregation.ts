import axios from 'axios'
import { selectorFamily } from 'recoil'

export type FetchCollectionAggregationOutput = {
  attributes: {
    trait: string
    options: string[]
  }[]
}

const fetchCollectionAggregation = selectorFamily<
  FetchCollectionAggregationOutput,
  string
>({
  key: 'fetchCollectionAggregation',
  get: (symbol: string) => async () => {
    const { data } = await axios.get<FetchCollectionAggregationOutput>(
      `/data/${symbol}-AGGREGATION.json`
    )

    return data
  },
})

export default fetchCollectionAggregation
