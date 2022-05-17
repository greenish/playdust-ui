import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { ParsedTokenAccountType } from './ParsedTokenAccountType';

interface AccountData extends ParsedAccountData {
  parsed: ParsedTokenAccountType;
}

type TokenAccountsType = {
  pubkey: PublicKey;
  account: AccountInfo<AccountData>;
};

export default TokenAccountsType;