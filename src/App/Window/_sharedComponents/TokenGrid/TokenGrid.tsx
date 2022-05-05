import React from 'react';
import OpenSearchNFTSourceType from '../../../../_types/OpenSearchNFTSourceType';
import TokenGroup from './TokenGroup/TokenGroup';
import TokenList from './TokenList';

interface TokenGridBaseProps {
  initialized: boolean;
  imageSize: number;
  cardGap: number;
  contentHeight: number;
  rowGap: number;
  next?: () => void;
}

export interface TokenListProps extends TokenGridBaseProps {
  tokens: OpenSearchNFTSourceType[];
  total: number;
}

export interface TokenGroupProps extends TokenGridBaseProps {
  totalRows: number;
  grouped: {
    key: string;
    groupLabel: string;
    groupSecondary?: string;
    groupTotal: number;
    groupHref: string;
    nfts: OpenSearchNFTSourceType[];
  }[];
}

type TokenGridProps = TokenListProps | TokenGroupProps;

function TokenGrid(props: TokenGridProps) {
  if ('grouped' in props) {
    return <TokenGroup {...props} />;
  }

  return <TokenList {...props} />;
}

export default TokenGrid;
