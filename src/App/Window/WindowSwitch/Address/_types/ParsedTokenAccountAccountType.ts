import {
  boolean,
  enums,
  Infer,
  literal,
  number,
  optional,
  string,
  type,
} from 'superstruct';
import PubkeyFromStringType from './PubkeyFromStringType';

const TokenAmount = type({
  decimals: number(),
  uiAmountString: string(),
  uiAmount: number(),
  amount: string(),
});

const AccountState = enums(['initialized', 'uninitialized', 'frozen']);

const TokenAccountInfo = type({
  mint: PubkeyFromStringType,
  owner: PubkeyFromStringType,
  tokenAmount: TokenAmount,
  delegate: optional(PubkeyFromStringType),
  state: AccountState,
  isNative: boolean(),
  rentExemptReserve: optional(TokenAmount),
  delegatedAmount: optional(TokenAmount),
  closeAuthority: optional(PubkeyFromStringType),
});

export type ParsedTokenAccountAccountType = Infer<
  typeof ParsedTokenAccountAccountType
>;
export const ParsedTokenAccountAccountType = type({
  type: literal('account'),
  info: TokenAccountInfo,
});
