import {
  Connection,
  ParsedInnerInstruction,
  ParsedInstruction,
  ParsedMessage,
  ParsedMessageAccount,
  ParsedTransaction,
  ParsedTransactionMeta,
  ParsedTransactionWithMeta,
  PartiallyDecodedInstruction,
  PublicKey,
  TokenAmount,
  TokenBalance,
  TransactionError,
} from '@solana/web3.js';
import { selector } from 'recoil';
import {
  any,
  array,
  boolean,
  Describe,
  Infer,
  instance,
  nullable,
  number,
  object,
  optional,
  string,
  type,
  union,
} from 'superstruct';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import txStateAtom from './txStateAtom';

type ParsedInstructionType = Infer<typeof ParsedInstructionType>;
const ParsedInstructionType: Describe<ParsedInstruction> = type({
  program: string(),
  programId: instance(PublicKey),
  parsed: any(),
});

type PartiallyDecodedInstructionType = Infer<
  typeof PartiallyDecodedInstructionType
>;
const PartiallyDecodedInstructionType: Describe<PartiallyDecodedInstruction> =
  type({
    programId: instance(PublicKey),
    accounts: array(instance(PublicKey)),
    data: string(),
  });

type ParsedMessageAccountType = Infer<typeof ParsedMessageAccountType>;
const ParsedMessageAccountType: Describe<ParsedMessageAccount> = type({
  pubkey: instance(PublicKey),
  signer: boolean(),
  writable: boolean(),
});

type ParsedMessageType = Infer<typeof ParsedMessageType>;
const ParsedMessageType: Describe<ParsedMessage> = type({
  accountKeys: array(ParsedMessageAccountType),
  instructions: array(
    union([ParsedInstructionType, PartiallyDecodedInstructionType])
  ),
  recentBlockhash: string(),
});

type ParsedTransactionType = Infer<typeof ParsedTransactionType>;
const ParsedTransactionType: Describe<ParsedTransaction> = type({
  signatures: array(string()),
  message: ParsedMessageType,
});

type ParsedInnerInstructionType = Infer<typeof ParsedInnerInstructionType>;
const ParsedInnerInstructionType: Describe<ParsedInnerInstruction> = type({
  index: number(),
  instructions: array(
    union([ParsedInstructionType, PartiallyDecodedInstructionType])
  ),
});

type TokenAmountType = Infer<typeof TokenAmountType>;
const TokenAmountType: Describe<TokenAmount> = type({
  amount: string(),
  decimals: number(),
  uiAmount: nullable(number()),
  uiAmountString: optional(string()),
});

type TokenBalanceType = Infer<typeof TokenBalanceType>;
const TokenBalanceType: Describe<TokenBalance> = type({
  accountIndex: number(),
  mint: string(),
  uiTokenAmount: TokenAmountType,
});

type TransactionErrorType = Infer<typeof TransactionErrorType>;
const TransactionErrorType: Describe<TransactionError> = union([
  object(),
  string(),
]);

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

type ParsedTransactionWithMetaType = Infer<
  typeof ParsedTransactionWithMetaType
>;
const ParsedTransactionWithMetaType: Describe<ParsedTransactionWithMeta> = type(
  {
    slot: number(),
    transaction: ParsedTransactionType,
    meta: nullable(ParsedTransactionMetaType),
    blockTime: optional(nullable(number())),
  }
);

type ParsedConfirmedTransactionType = ParsedTransactionWithMetaType;
const ParsedConfirmedTransactionType = ParsedTransactionWithMetaType;

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
