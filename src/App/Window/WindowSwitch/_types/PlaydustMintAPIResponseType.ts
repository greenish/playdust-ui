import { MetadataData } from '@metaplex-foundation/mpl-token-metadata';

type MetaplexOffChainDataType = {
  name: string;
  symbol: string;
  external_url: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
  collection?: {
    name: string;
    family: string;
  };
};

type PlaydustMintAPIResponseType = {
  mintOnChainMetadata: MetadataData;
  mintOffChainMetadata: MetaplexOffChainDataType;
  mintRarity?: {
    normalizedRarityScore?: number;
    rarityScore?: number;
  };
  playdustCollection?: {
    id: string;
    type: string;
  };
};

export default PlaydustMintAPIResponseType;
