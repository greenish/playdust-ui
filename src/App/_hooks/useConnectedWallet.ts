import { useWallet } from '@solana/wallet-adapter-react';

function useConnectedWallet() {
  const wallet = useWallet();

  return wallet.publicKey?.toString();
}

export default useConnectedWallet;
