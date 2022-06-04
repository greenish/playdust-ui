import { useWallet } from '@solana/wallet-adapter-react';
import { useRecoilValue } from 'recoil';
import addressStateAtom from '../../../_atoms/addressStateAtom';

function useIsCurrentUser() {
  const wallet = useWallet();
  const addressState = useRecoilValue(addressStateAtom);

  return (
    wallet.connected &&
    wallet.publicKey &&
    wallet.publicKey.toString() === addressState?.pubkey.toString()
  );
}

export default useIsCurrentUser;
