import { MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import axios from 'axios';
import { selector } from 'recoil';
import addressStateAtom from '../../../_atoms/addressStateAtom';

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
};

const playdustNftDataAtom = selector<PlaydustMintAPIResponseType | null>({
  key: 'playdustNftDataAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);

    if (!addressState) {
      return null;
    }

    const { data } = await axios.get<PlaydustMintAPIResponseType>(
      `/playdust-api/mint?mintAddress=${addressState.pubkey.toString()}`
    );

    if (!data || !data.mintOffChainMetadata || !data.mintOnChainMetadata) {
      return null;
    }

    return data;
  },
});

export default playdustNftDataAtom;
