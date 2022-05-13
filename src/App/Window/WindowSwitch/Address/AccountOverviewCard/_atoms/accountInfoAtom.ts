import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import { selector } from 'recoil';
import SolanaClusterType from '../../../../../../_types/SolanaClusterType';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from '../../_atoms/addressStateAtom';

const fetchAccountInfo = async (
  solanaCluster: SolanaClusterType,
  pubkey: PublicKey
) => {
  if (!solanaCluster || !pubkey) {
    return null;
  }

  const { endpoint } = solanaCluster;

  const connection = new Connection(endpoint, 'confirmed');

  const { value } = await connection.getParsedAccountInfo(pubkey);

  return value;
};

const accountInfoAtom = selector<AccountInfo<
  Buffer | ParsedAccountData
> | null>({
  key: 'accountInfo',
  get: ({ get }) => {
    const addressState = get(addressStateAtom);

    const solanaCluster = get(solanaClusterAtom);

    return fetchAccountInfo(solanaCluster, addressState.pubkey);
  },
});

export default accountInfoAtom;
