import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata';
import MetaplexOffChainDataType from './MetaplexOffChainDataType';

interface OpenSearchNFTSourceType {
  mint: string;
  data: MetadataDataData;
  updateAuthority?: string;
  primarySaleHappened?: boolean;
  key?: number;
  offChainData: MetaplexOffChainDataType;
  heuristicCollectionId?: string;
  lastListPrice?: number;
  listed?: boolean;
  normalizedRarityScore?: number;
  normalizedStatisticalRarity?: number;
  rarityScore?: number;
  statisticalRarity?: number;
}

export default OpenSearchNFTSourceType;
