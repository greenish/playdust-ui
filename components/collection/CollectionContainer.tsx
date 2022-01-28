import { useRecoilValue, useSetRecoilState } from 'recoil'
import { collectionCursor, fetchCollectionPages } from '../../store'
import TokenContainer from '../token/TokenContainer'

const CollectionContainer = () => {
  const setCursor = useSetRecoilState(collectionCursor)
  const { initialized, tokens, total } = useRecoilValue(fetchCollectionPages)

  return (
    <TokenContainer
      initialized={initialized}
      tokens={tokens}
      hasMore={total > tokens.length}
      next={() => {
        setCursor((cursor) => cursor + 1)
      }}
    />
  )
}

export default CollectionContainer
