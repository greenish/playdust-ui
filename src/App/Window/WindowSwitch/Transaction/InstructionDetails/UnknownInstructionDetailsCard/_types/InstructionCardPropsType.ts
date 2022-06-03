import {
  ParsedInstruction,
  ParsedTransaction,
  PartiallyDecodedInstruction,
  SignatureResult,
  TransactionInstruction,
} from '@solana/web3.js';

interface InstructionCardPropsType {
  ix: ParsedInstruction | PartiallyDecodedInstruction | TransactionInstruction;
  tx: ParsedTransaction;
  result: SignatureResult;
  index: number;
  innerCards?: JSX.Element[];
  childIndex?: number;
}

export default InstructionCardPropsType;
