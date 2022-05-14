
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';
import fetchUserDomains from '../../_helpers/fetchUserDomains';


type AccountDomainsType = Awaited<ReturnType<typeof fetchUserDomains>>;

const accountDomainsAtom = selector<AccountDomainsType>({
  key: 'accountDomainsAtom',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const solanaCluster = {
      network: WalletAdapterNetwork.Mainnet,
      endpoint: 'https://explorer-api.mainnet-beta.solana.com/', // 'https://solana-api.projectserum.com', 'https://api.mainnet-beta.solana.com',
    };

    console.log("fetchUserDomains")

    return fetchUserDomains(solanaCluster, addressState.pubkey );
  },
});

export default accountDomainsAtom;
