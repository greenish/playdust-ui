import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';

// keeping all types nullable to enforce defensive programming around external type.
interface ParsedTokenAccountData extends ParsedAccountData {
  parsed: {
    info?: {
      isNative?: boolean;
      mint?: string;
      owner?: string;
      state?: string;
      tokenAmount?: {
        amount?: string;
        decimals?: number;
        uiAmount?: number;
        uiAmountString?: string;
      };
    };
    type?: 'account';
  };
}

type TokenAccountsType = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedTokenAccountData>;
};

export default TokenAccountsType;
