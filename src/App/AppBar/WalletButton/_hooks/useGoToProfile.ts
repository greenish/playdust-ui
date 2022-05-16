import { useWallet } from '@solana/wallet-adapter-react';
import usePushWindowHash from '../../../_hooks/usePushWindowHash';

const useGoToProfile = () => {
  const wallet = useWallet();
  const pushWindowHash = usePushWindowHash();

  return () => {
    if (wallet.publicKey) {
      const state = wallet.publicKey.toBase58();
      pushWindowHash({ type: 'address', state }, { newTab: true });
    }
  };
};

export default useGoToProfile;
