import { atom } from 'recoil';
import UserProfileType from '../../../_types/UserProfileType';

// type UserProfileType = {
//   username: string;
//   email: string;
//   bio: string;
//   twitter: string;
//   picture: string;
//   roles: Array<string>;
// };

const userProfileAtom = atom<UserProfileType | null>({
  key: 'userProfileAtom',
  default: null,
});

// const userProfileAtom = atom<UserProfileType | null>({
//   key: 'userProfileAtom',
//   default: selector({
//     key: 'userProfile/default',
//     get: async ({ get }) => {
//       const connectedWallet = get(connectedWalletAtom);
//       const tokens = get(tokensAtom);

//       if (connectedWallet && tokens) {
//         try {
//           const { data } = await profileApi.get<UserProfileType>('/read', {
//             params: {
//               walletAddress: connectedWallet,
//             },
//             headers: {
//               Authorization: `Bearer ${tokens.accessToken}`,
//             },
//           });

//           return data;
//         } catch (e) {
//           console.error('Unable to fetch user profile', e);
//         }
//       }

//       return null;
//     },
//   }),
// });

export default userProfileAtom;
