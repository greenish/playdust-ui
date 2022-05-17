import { Connection, PublicKey } from '@solana/web3.js';
import { create } from 'superstruct';
import SolanaClusterType from '../../../../../../_types/SolanaClusterType';
import safePubkey from '../../_helpers/safePubkey';
import { ParsedTokenAccountType } from '../_types/ParsedTokenAccountType';
import { TokenAccountsType } from '../_types/TokenAccountsType';

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

async function fetchTokenAccountsForAddress(
  cluster: SolanaClusterType,
  pubkey: PublicKey
): Promise<TokenAccountsType[]> {
  const connection = new Connection(cluster.endpoint);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    safePubkey(pubkey),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const typedTokenAccounts = tokenAccounts.value.map<TokenAccountsType>(
    (account) => ({
      ...account,
      account: {
        ...account.account,
        data: {
          ...account.account.data,
          parsed: create(account.account.data.parsed, ParsedTokenAccountType),
        },
      },
    })
  );

  return typedTokenAccounts;
}

export default fetchTokenAccountsForAddress;
