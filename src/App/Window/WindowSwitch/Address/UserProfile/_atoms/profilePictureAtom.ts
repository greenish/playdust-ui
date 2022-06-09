import { atom, selector } from 'recoil';
import nftByMintAtom from '../../../_atoms/nftByMintAtom';
import publicProfileAtom from './publicProfileAtom';

type ProfilePictureData = {
  profilePictureMintAddress: string;
  profilePictureImage: string;
};

const profilePictureAtom = atom<ProfilePictureData | null>({
  key: 'profilePictureAtom',
  default: selector({
    key: 'profilePicture/default',
    get: ({ get }) => {
      const publicProfile = get(publicProfileAtom);

      if (!publicProfile) {
        return null;
      }

      const nft = get(nftByMintAtom(publicProfile.profilePictureMintAddress));

      if (!nft || !nft.offChainData) {
        return null;
      }

      return {
        profilePictureMintAddress: nft.mint,
        profilePictureImage: nft.offChainData.image,
      };
    },
  }),
});

export default profilePictureAtom;
