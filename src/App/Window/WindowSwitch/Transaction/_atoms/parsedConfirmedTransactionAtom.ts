import { Connection } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import txStateAtom from './txStateAtom';

/*
import {
  any,
  array,
  assert,
  boolean,
  define,
  Describe,
  Infer,
  instance,
  nullable,
  number,
  optional,
  string,
  type,
  union,
  unknown,
} from 'superstruct';


const PublicKeyType = any();

type ParsedInstructionType = Infer<typeof ParsedInstructionType>;
const ParsedInstructionType: Describe<ParsedInstruction> = type({
  program: string(),
  programId: PublicKeyType,
  parsed: any(),
});

type PartiallyDecodedInstructionType = Infer<typeof PartiallyDecodedInstructionType>;
const PartiallyDecodedInstructionType: Describe<PartiallyDecodedInstruction> = type({
  programId: PublicKeyType,
  accounts: array(PublicKeyType),
  data: string(),
});

type ParsedMessageAccountType = Infer<typeof ParsedMessageAccountType>;
const ParsedMessageAccountType: Describe<ParsedMessageAccount> = type({
  pubkey: PublicKeyType,
  signer: boolean(),
  writable: boolean(),
});

type ParsedMessageType = Infer<typeof ParsedMessageType>;
const ParsedMessageType: Describe<ParsedMessage> = type({
  accountKeys: array(ParsedMessageAccountType),
  instructions: array(union([ ParsedInstructionType, PartiallyDecodedInstructionType ])),
  recentBlockhash: string(),
});

type ParsedTransactionType = Infer<typeof ParsedTransactionType>;
const ParsedTransactionType: Describe<ParsedTransaction> = type({
  signatures: array(string()),
  message: ParsedMessageType,
});

type ParsedInnerInstruction = Infer<typeof ParsedInnerInstructionType>;
const ParsedInnerInstructionType: Describe<ParsedInnerInstruction> = type({

});

type TokenBalanceType = Infer<typeof TokenBalanceType>;
const TokenBalanceType: Describe<TokenBalance> = type({

});

type TransactionError = Infer<typeof TransactionErrorType>;
const TransactionErrorType: Describe TransactionError

type ParsedTransactionMetaType = Infer<typeof ParsedTransactionType>;
const ParsedTransactionMetaType: Describe<ParsedTransactionMeta> = type({
  fee: number(),
  innerInstructions: optional(nullable(array(ParsedInnerInstructionType))),
  preBalances: array(number()),
  postBalances: array(number()),
  logMessages: optional(nullable(array(string()))),
  preTokenBalances: optional(nullable(array(TokenBalanceType))),
  postTokenBalances: optional(nullable(array(TokenBalanceType))),
  err: nullable(TransactionErrorType),
});

type ParsedTransactionWithMetaType = Infer<typeof ParsedTransactionWithMetaType>;
const ParsedTransactionWithMetaType: Describe<ParsedTransactionWithMeta> = type({
  slot: number(),
  transaction: ParsedTransactionType,
  meta: nullable(ParsedTransactionMetaType),
  blockTime: optional(nullable(number())),
});

type ParsedConfirmedTransactionType = ParsedTransactionWithMetaType;
const ParsedConfirmedTransactionType = ParsedTransactionWithMetaType;
*/

const parsedConfirmedTransactionAtom =
  selector<ParsedConfirmedTransactionType | null>({
    key: 'parsedConfirmedTransaction',
    get: async ({ get }) => {
      const txState = get(txStateAtom);
      const solanaCluster = get(solanaClusterAtom);

      if (!txState) {
        return null;
      }

      const { state: signature } = txState;

      const connection = new Connection(solanaCluster.endpoint);

      const parsedConfirmedTransaction =
        connection.getParsedConfirmedTransaction(signature);

      // assert(parsedConfirmedTransaction, ParsedConfirmedTransactionType);

      return parsedConfirmedTransaction;
    },
  });

export default parsedConfirmedTransactionAtom;
