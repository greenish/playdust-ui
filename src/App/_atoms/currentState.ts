import { atom } from 'recoil';
import type { WindowType } from './appState';

const currentState = atom<WindowType | undefined>({
  key: 'currentState',
  default: undefined,
});

export default currentState;
