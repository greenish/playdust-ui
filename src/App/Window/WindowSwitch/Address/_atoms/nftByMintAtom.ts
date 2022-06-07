import { selectorFamily } from 'recoil';
import frontendApi from '../../../_helpers/frontendApi';
import OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';

const nftByMintAtom = selectorFamily<OpenSearchNFTSourceType | null, string>({
  key: 'nftByMintAtom',
  get: (mintAddress) => async () => {
    if (!mintAddress) {
      return null;
    }

    const { data } = await frontendApi.post<OpenSearchNFTSourceType>(
      `/mint?address=${mintAddress}`
    );

    return data;
  },
});

export default nftByMintAtom;
