import { useWallet } from '@solana/wallet-adapter-react';
import safePromise from '../../../_helpers/safePromise';
import usePushWindowHash from '../../../_hooks/usePushWindowHash';

const useGoToProfile = () => {
  const wallet = useWallet();
  const pushWindowHash = usePushWindowHash();

  return () => {
    if (wallet.publicKey) {
      const state = wallet.publicKey.toBase58();
      safePromise(pushWindowHash({ type: 'address', state }, { newTab: true }));
    }
  };
};

export default useGoToProfile;
