import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata';
import { selector } from 'recoil';
import MetaplexOffChainDataType from '../../../../../../_types/MetaplexOffChainDataType';
import type OpenSearchNFTSourceType from '../../../../../../_types/OpenSearchNFTSourceType';
import frontendApi from '../../../../_helpers/frontendApi';
import safePubkeyString from '../../../_helpers/safePubkeyString';
import addressStateAtom from '../../_atoms/addressStateAtom';

type PlaydustNftData = {
  metaplexOffChainData: MetaplexOffChainDataType;
  metaplexOnChainData: MetadataDataData;
  rarity: {
    normalizedRarity?: number;
    absoluteRarity?: number;
  };
};

const playdustNftDataAtom = selector<PlaydustNftData | null>({
  key: 'playdustNftDataAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);

    if (!addressState) {
      return null;
    }

    const { data } = await frontendApi.post<OpenSearchNFTSourceType>(
      `/mint?address=${safePubkeyString(addressState.pubkey)}`
    );

    if (!data || !data.offChainData || !data.data) {
      return null;
    }

    const playdustNftData: PlaydustNftData = {
      metaplexOffChainData: data.offChainData,
      metaplexOnChainData: data.data,
      rarity: {
        normalizedRarity: data.normalizedRarityScore,
        absoluteRarity: data.rarityScore,
      },
    };

    return playdustNftData;
  },
});

export default playdustNftDataAtom;
