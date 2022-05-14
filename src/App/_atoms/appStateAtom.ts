import { atom } from 'recoil';
import getDefaultAppState from '../_helpers/getDefaultAppState';
import parseAppState from '../_helpers/parseAppState';
import type AppStateType from '../_types/AppStateType';

const appStateAtom = atom<AppStateType>({
  key: 'appStateAtom',
  default: getDefaultAppState(),
  effects: [
    ({ setSelf, onSet, trigger, node }) => {
      if (typeof window === 'undefined') {
        return;
      }

      const { key } = node;

      const savedValue = localStorage.getItem(key);

      if (trigger === 'get' && savedValue) {
        const appState = parseAppState(savedValue);

        if (!appState) {
          return localStorage.removeItem(key);
        }

        setSelf(appState);
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          return localStorage.removeItem(key);
        }

        const nextValue = JSON.stringify(newValue);

        if (parseAppState(nextValue)) {
          localStorage.setItem(key, nextValue);
        }
      });
    },
  ],
});

export default appStateAtom;
