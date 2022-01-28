import TokenContainer from '../token/TokenContainer'
import { collectionCursor, fetchCollectionPages } from '../../store'
import { useRecoilValue, useSetRecoilState } from 'recoil'

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
