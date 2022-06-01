import { selector } from 'recoil';
import currentStateAtom from '../../../_atoms/currentStateAtom';
import TxExplorerType from '../_types/TxExplorerType';

const txStateAtom = selector<TxExplorerType>({
  key: 'txStateAtom',
  get: ({ get }) => {
    const currentState = get(currentStateAtom);

    if (currentState?.type !== 'tx') {
      throw new Error('txState unavailable');
    }

    const { type, state } = currentState;

    return {
      type,
      state,
    };
  },
});

export default txStateAtom;
