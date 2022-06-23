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

      // Allow overriding the hubspot isWhitelisted field via localStorage
      const userIsWhitelisted =
        localStorage.getItem('userIsWhitelisted') === 'true';
      if (userIsWhitelisted) {
        publicProfile.isWhitelisted = true;
      }

      // If the whitelist is not active, we unwhitelist all users.
      if (!process.env.WHITELIST_ACTIVE) {
        publicProfile.isWhitelisted = false;
      }

      return publicProfile;
    } catch (e) {
      // ignore
    }

    return null;
  },
});

export default currentUserProfileAtom;
