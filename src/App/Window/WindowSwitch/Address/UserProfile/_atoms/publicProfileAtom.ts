import { atom, selector } from 'recoil';
import addressStateAtom from '../../_atoms/addressStateAtom';
import profileApi from '../_helpers/profileApi';
import PublicProfileType from '../_types/PublicProfileType';

const publicProfileAtom = atom<PublicProfileType | null>({
  key: 'publicProfileAtom',
  default: selector({
    key: 'publicProfile/default',
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
          // ignore
        }
      }

      return null;
    },
  }),
});

export default publicProfileAtom;
