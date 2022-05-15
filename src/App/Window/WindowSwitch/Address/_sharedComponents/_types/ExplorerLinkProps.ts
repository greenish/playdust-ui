import { PublicKey } from '@solana/web3.js';
import WindowUnion from '../../../../../_types/WindowUnionType';

interface ExplorerLinkProps {
  to: PublicKey | string | number;
  label?: string;
  type: WindowUnion;
  allowCopy?: boolean;
  ellipsis?: {
    cutoff: number;
    remain: number;
    ellipsis?: string;
  };
}
export default ExplorerLinkProps;
