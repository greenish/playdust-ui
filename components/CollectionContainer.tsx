import { MetaplexCollectionIdentifier } from '../solana/types'
import TokenContainer from './TokenContainer'
import { fetchCollectionOnchain } from '../store'
import { useRecoilValue } from 'recoil'

interface CollectionContainerProps {
  identifier: MetaplexCollectionIdentifier
}

const CollectionContainer = ({ identifier }: CollectionContainerProps) => {
  const collectionData = useRecoilValue(fetchCollectionOnchain(identifier))

  return (
    <TokenContainer tokens={collectionData} />
  )
}

export default CollectionContainer
