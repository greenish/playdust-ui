import { Message, Transaction } from '@solana/web3.js';

interface TransactionInfoType {
  message: Message;
  signatures: string[];
  transaction: Transaction;
}

export default TransactionInfoType;
