import { PublicKey } from '@solana/web3.js';
import ellipsisify from './ellipsisify';

const shortenPublicKey = (pk: PublicKey | string) =>
  ellipsisify(pk.toString(), 4, 4);

export default shortenPublicKey;
