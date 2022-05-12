import { PublicKey } from '@solana/web3.js';
import ellipsisify from '../../../_helpers/ellipsisify';

const shortenPublicKey = (pk: PublicKey | string) =>
  ellipsisify(pk.toString(), 4, 4);

export default shortenPublicKey;
