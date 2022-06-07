import { MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import { selector } from 'recoil';
import MetaplexOffChainDataType from '../../../_types/MetaplexOffChainDataType';
import addressStateAtom from '../../_atoms/addressStateAtom';
import nftByMintAtom from '../../_atoms/nftByMintAtom';
import safePubkeyString from '../../_helpers/safePubkeyString';

type PlaydustNftData = {
  metaplexOffChainData: MetaplexOffChainDataType;
  metaplexOnChainData: MetadataData;
  rarity: {
    normalizedRarity?: number;
    absoluteRarity?: number;
  };
};

const playdustNftDataAtom = selector<PlaydustNftData | null>({
  key: 'playdustNftDataAtom',
  get: ({ get }) => {
    const addressState = get(addressStateAtom);

    if (!addressState) {
      return null;
    }

    const data = get(nftByMintAtom(safePubkeyString(addressState.pubkey)));

    if (!data || !data.offChainData || !data.data) {
      return null;
    }

    const playdustNftData: PlaydustNftData = {
      metaplexOffChainData: data.offChainData,
      metaplexOnChainData: data as unknown as MetadataData,
      rarity: {
        normalizedRarity: data.normalizedRarityScore,
        absoluteRarity: data.rarityScore,
      },
    };

    return playdustNftData;
  },
});

export default playdustNftDataAtom;
