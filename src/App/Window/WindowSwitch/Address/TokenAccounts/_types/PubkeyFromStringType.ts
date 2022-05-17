import { PublicKey } from '@solana/web3.js';
import { coerce, instance, string } from 'superstruct';

const PubkeyFromStringType = coerce(
  instance(PublicKey),
  string(),
  (value) => new PublicKey(value)
);

export default PubkeyFromStringType;
