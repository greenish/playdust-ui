import { MetaplexCollectionIdentifier } from '../solana/types'
import TokenContainer from './TokenContainer'
import {
  collectionCursor,
  fetchNextCollectionPage,
} from '../store'
import {
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

interface CollectionContainerProps {
  identifier: MetaplexCollectionIdentifier
}

const CollectionContainer = ({ identifier }: CollectionContainerProps) => {
  const setCursor = useSetRecoilState(collectionCursor)
  const {
    initialized,
    tokens,
    count,
  } = useRecoilValue(fetchNextCollectionPage(identifier))

  return (
    <TokenContainer
      initialized={initialized}
      tokens={tokens}
      hasMore={count > tokens.length}
      next={() => setCursor(cursor => cursor + 1)}
    />
  )
}

export default CollectionContainer
