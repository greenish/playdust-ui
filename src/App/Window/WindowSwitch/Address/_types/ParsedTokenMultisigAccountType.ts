import { array, boolean, Infer, literal, number, type } from 'superstruct';
import PubkeyFromStringType from './PubkeyFromStringType';

const MultisigAccountInfo = type({
  numRequiredSigners: number(),
  numValidSigners: number(),
  isInitialized: boolean(),
  signers: array(PubkeyFromStringType),
});

export type ParsedTokenMultisigAccountType = Infer<
  typeof ParsedTokenMultisigAccountType
>;
export const ParsedTokenMultisigAccountType = type({
  type: literal('multisig'),
  info: MultisigAccountInfo,
});
