import { useWallet } from '@solana/wallet-adapter-react';
import base58 from 'bs58';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import fetchNonce from '../../../_helpers/fetchNonce';
import connectedWalletAtom from '../_atoms/connectedWalletAtom';
import signedAuthMesssageAtom from '../_atoms/signedAuthMesssageAtom';

const useSignAuthMessage = () => {
  const wallet = useWallet();
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const setSignedAuthMessage = useSetRecoilState(signedAuthMesssageAtom);

  return async () => {
    if (wallet.signMessage && connectedWallet) {
      const nonce = await fetchNonce(connectedWallet);
      const nonceMessage = new TextEncoder().encode(nonce);
      const messageArray = await wallet.signMessage(nonceMessage);
      const message = base58.encode(messageArray);

      setSignedAuthMessage({
        message,
        nonce,
      });
    }
  };
};

export default useSignAuthMessage;
