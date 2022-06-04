import { selector } from 'recoil';
import addressStateAtom from '../../_atoms/addressStateAtom';
import profileApi from '../_helpers/profileApi';
import PublicProfileType from '../_types/PublicProfileType';

const publicProfileAtom = selector<PublicProfileType | null>({
  key: 'publicProfileAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);

    if (addressState) {
      try {
        const { data } = await profileApi.get<PublicProfileType>(
          '/public/read',
          {
            params: {
              walletAddress: addressState.pubkey.toString(),
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

export default publicProfileAtom;
