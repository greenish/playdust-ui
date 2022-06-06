import { selectorFamily } from 'recoil';
import OpenSearchNFTSourceType from '../../../../../_types/OpenSearchNFTSourceType';
import frontendApi from '../../../_helpers/frontendApi';

const nftByMintAtom = selectorFamily<OpenSearchNFTSourceType, string>({
  key: 'nftByMintAtom',
  get: (mintAddress) => async () => {
    const { data } = await frontendApi.post<OpenSearchNFTSourceType>(
      `/mint?address=${mintAddress}`
    );

    return data;
  },
});

export default nftByMintAtom;
