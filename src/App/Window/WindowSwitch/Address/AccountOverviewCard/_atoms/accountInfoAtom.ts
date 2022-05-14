import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../../_atoms/solanaClusterAtom';
import addressStateAtom from './addressStateAtom';

type AccountInfoType = AccountInfo<Buffer | ParsedAccountData> & {
  space: number;
  pubkey: PublicKey;
  label?: string;
};

const accountInfoAtom = selector<AccountInfoType>({
  key: 'accountInfo',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const solanaCluster = get(solanaClusterAtom);

    const connection = new Connection(solanaCluster.endpoint, 'confirmed');
    const accountInfoResult = await connection.getParsedAccountInfo(
      addressState.pubkey
    );
    const accountInfo = accountInfoResult?.value;

    if (!accountInfo) {
      throw new Error(`Could Not Fetch AccountInfo for ${addressState.pubkey}`);
    }

    return {
      ...accountInfo,
      label: addressState.label,
      pubkey: addressState.pubkey,
      space: !('parsed' in accountInfo.data)
        ? accountInfo.data.length
        : accountInfo.data.space,
    };
  },
});

export default accountInfoAtom;
