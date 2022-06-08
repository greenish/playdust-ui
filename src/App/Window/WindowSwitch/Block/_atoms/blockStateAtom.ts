import { BlockResponse, Connection } from '@solana/web3.js';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../../_atoms/solanaClusterAtom';
import windowStateAtom from '../../../_atoms/windowStateAtom';
// import BlockExplorerType from '../_types/BlockExplorerType';

const blockStateAtom = selector<BlockResponse | null>({
  key: 'blockState',
  get: async ({ get }) => {
    const windowState = get(windowStateAtom);

    if (windowState?.type !== 'block') {
      return null;
    }

    const { state } = windowState;

    const slot = Number(state);

    const { endpoint } = get(solanaClusterAtom);

    const connection = new Connection(endpoint, 'confirmed');

    const block = await connection.getBlock(slot);

    return block;
  },
});

export default blockStateAtom;
