import { selector } from 'recoil';
import { create } from 'superstruct';
import profileApi from '../_helpers/profileApi';
import PublicProfileType from '../_types/PublicProfileType';
import connectedWalletAtom from './connectedWalletAtom';

const currentUserProfileAtom = selector<PublicProfileType | null>({
  key: 'currentUserProfileAtom',
  get: async ({ get }) => {
    const connectedWallet = get(connectedWalletAtom);

    if (!connectedWallet) {
      return null;
    }

    try {
      const { data } = await profileApi.get<PublicProfileType>('/public/read', {
        params: {
          walletAddress: connectedWallet,
        },
      });

      const publicProfile = create(data, PublicProfileType);

      // Needed until backend work is done, since currently you can complete the whitelist process.
      const userIsWhitelisted =
        localStorage.getItem('userIsWhitelisted') === 'true';
      if (userIsWhitelisted) {
        publicProfile.isWhitelisted = true;
      }

      return publicProfile;
    } catch (e) {
      // ignore
    }

    return null;
  },
});

export default currentUserProfileAtom;
