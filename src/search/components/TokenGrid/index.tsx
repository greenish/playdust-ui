import { NFTSource } from '../../types/OpenSearchIndex'
export { default as TokenGroup } from './TokenGroup'
export { default as TokenList } from './TokenList'

interface TokenGridProps {
  initialized: boolean
  imageSize: number
  cardGap: number
  contentHeight: number
  rowGap: number
  next?: () => any
}

export interface TokenListProps extends TokenGridProps {
  tokens: NFTSource[]
  total: number
}

export interface TokenGroupProps extends TokenGridProps {
  totalRows: number
  grouped: {
    key: string
    groupLabel: string
    groupSecondary?: string
    groupTotal: number
    groupHref: string
    nfts: NFTSource[]
  }[]
}
