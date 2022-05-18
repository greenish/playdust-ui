import {
  boolean,
  Infer,
  literal,
  nullable,
  number,
  string,
  type,
} from 'superstruct';
import PubkeyFromStringType from './PubkeyFromStringType';

const MintAccountInfo = type({
  mintAuthority: nullable(PubkeyFromStringType),
  supply: string(),
  decimals: number(),
  isInitialized: boolean(),
  freezeAuthority: nullable(PubkeyFromStringType),
});

export type ParsedTokenMintAccountType = Infer<
  typeof ParsedTokenMintAccountType
>;
export const ParsedTokenMintAccountType = type({
  type: literal('mint'),
  info: MintAccountInfo,
});
