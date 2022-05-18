import type OpenSearchNFTSourceType from '../../../../../../_types/OpenSearchNFTSourceType';

interface TokenCardProps {
  imageSize: number;
  contentHeight: number;
  skeleton?: boolean;
  metadata?: OpenSearchNFTSourceType;
  disableQuickFilter?: boolean;
}

export default TokenCardProps;
