import { atom, selector, selectorFamily } from 'recoil';
import OpenSearchNFTSourceType from '../../../../../../_types/OpenSearchNFTSourceType';
import frontendApi from '../../../../_helpers/frontendApi';
import publicProfileAtom from './publicProfileAtom';

type ProfilePictureData = {
  profilePictureMintAddress: string;
  profilePictureImage: string;
};

const profilePictureQuery = selectorFamily<ProfilePictureData, string>({
  key: 'profilePictureQuery',
  get: (mintAddress) => async () => {
    const { data } = await frontendApi.post<OpenSearchNFTSourceType>(
      `/mint?address=${mintAddress}`
    );

    return {
      profilePictureMintAddress: data.mint,
      profilePictureImage: data.offChainData.image,
    };
  },
});

const profilePictureAtom = atom<ProfilePictureData | null>({
  key: 'profilePictureAtom',
  default: selector({
    key: 'profilePicture/default',
    get: ({ get }) => {
      const publicProfile = get(publicProfileAtom);

      return publicProfile
        ? get(profilePictureQuery(publicProfile.profilePictureMintAddress))
        : null;
    },
  }),
});

export default profilePictureAtom;
