import type OpenSearchCollectionSourceType from '../../../../_types/OpenSearchCollectionSourceType'

const humanizeCollection = ({
  name,
  symbol,
}: Partial<OpenSearchCollectionSourceType>) => {
  if (name && symbol) {
    return `${name} (${symbol})`
  }

  return name || symbol
}

export default humanizeCollection
