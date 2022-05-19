import { selector } from 'recoil';
import profileApi from '../_helpers/profileApi';
import connectedWalletAtom from './connectedWalletAtom';
import tokensAtom from './tokensAtom';

type UserProfileType = {
  username: string;
  email: string;
  bio: string;
  twitter: string;
  picture: string;
  roles: Array<string>;
};

const userProfileAtom = selector<UserProfileType | null>({
  key: 'userProfileAtom',
  get: async ({ get }) => {
    const connectedWallet = get(connectedWalletAtom);
    const tokens = get(tokensAtom);

    if (connectedWallet && tokens) {
      try {
        const { data } = await profileApi.get<UserProfileType>(
          `/${connectedWallet}`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        return data;
      } catch (e) {
        console.error('Unable to fetch user profile', e);
      }
    }

    return null;
  },
});

export default userProfileAtom;
