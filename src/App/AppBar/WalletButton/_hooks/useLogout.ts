import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useRecoilCallback } from 'recoil';
import connectedWalletAtom from '../_atoms/connectedWalletAtom';
import signedAuthMesssageAtom from '../_atoms/signedAuthMesssageAtom';
import tokensAtom from '../_atoms/tokensAtom';
import authenticationApi from '../_helpers/authenticationApi';

const useLogout = () => {
  const wallet = useWallet();
  const router = useRouter();

  const logoutCallback = useRecoilCallback(
    ({ snapshot, set, reset }) =>
      async () => {
        const tokens = await snapshot.getPromise(tokensAtom);

        await wallet.disconnect();

        reset(signedAuthMesssageAtom);
        set(tokensAtom, null);
        reset(connectedWalletAtom);

        try {
          if (tokens) {
            await authenticationApi.post(
              '/logout',
              {},
              {
                headers: {
                  Authorization: `Bearer ${tokens.refreshToken}`,
                },
              }
            );
          }
        } catch (e) {
          console.error('Unable to logout on server:', e);
        }

        if (tokens) {
          router.reload();
        }
      },
    [wallet]
  );

  return logoutCallback;
};

export default useLogout;
