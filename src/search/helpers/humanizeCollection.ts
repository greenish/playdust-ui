import { CollectionSource } from '../types/OpenSearchIndex'

const humanizeCollection = ({ name, symbol }: Partial<CollectionSource>) => {
  if (name && symbol) {
    return `${name} (${symbol})`
  }

  return name || symbol
}

export default humanizeCollection
