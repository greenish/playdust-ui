import { selector, waitForNone } from 'recoil'
import { cannedCollections } from '../solana'
import { MetaplexCollectionIdentifier } from '../solana/types'
import fetchCollectionAggregation, {
  FetchCollectionAggregationOutput,
} from './fetchCollectionAggregation'
import searchQuery from './searchQuery'

interface SearchAggregationsOutput extends FetchCollectionAggregationOutput {
  identifier: MetaplexCollectionIdentifier
}

const searchAggregations = selector<SearchAggregationsOutput[]>({
  key: 'searchAggregations',
  get: ({ get }) => {
    const query = get(searchQuery)
    const collections = query.flatMap((parent) =>
      parent
        .filter(
          (entry) =>
            entry.field === 'collection' &&
            entry.searchType === 'exact' &&
            entry.value
        )
        .map((entry) => entry.value)
    )
    const uniqueCollections = [...new Set(collections)]
    const identifiers = cannedCollections.filter((entry) =>
      uniqueCollections.includes(entry.name)
    )
    const loadable = get(
      waitForNone(
        identifiers.map((identifier) =>
          fetchCollectionAggregation(identifier.symbol)
        )
      )
    )

    const result = loadable.reduce<SearchAggregationsOutput[]>(
      (acc, curr, idx) => {
        if (curr.state === 'hasValue') {
          return [
            ...acc,
            {
              identifier: identifiers[idx],
              attributes: curr.contents.attributes,
            },
          ]
        }

        return acc
      },
      []
    )

    return result
  },
})

export default searchAggregations
