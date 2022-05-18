import { PublicKey } from '@solana/web3.js';
import { ParsedTokenAccountType } from './ParsedTokenAccountType';

type TokenAccountsType = {
  pubkey: PublicKey;
  data: ParsedTokenAccountType;
};

export default TokenAccountsType;
