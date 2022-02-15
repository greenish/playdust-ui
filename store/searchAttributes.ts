import { selector, waitForNone } from 'recoil'
import { cannedCollections } from '../solana'
import fetchCollectionAttributes, {
  CollectionAttribute,
} from './fetchCollectionAttributes'
import searchQuery from './searchQuery'

interface MultiCollectionAttribute extends CollectionAttribute {
  symbol: string
}

const searchAttributes = selector<MultiCollectionAttribute[]>({
  key: 'searchAttributes',
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
      uniqueCollections.includes(entry.name!)
    )
    const loadable = get(
      waitForNone(
        identifiers.map((identifier) =>
          fetchCollectionAttributes(identifier.symbol)
        )
      )
    )
    const result = loadable.flatMap((entry, idx) => {
      if (entry.state !== 'hasValue') {
        return []
      }

      const identifier = identifiers[idx]

      return entry.contents.map((attribute) => ({
        ...attribute,
        symbol: identifier.symbol,
      }))
    })

    return result
  },
})

export default searchAttributes
