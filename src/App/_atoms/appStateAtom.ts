import { atom } from 'recoil';
import getDefaultAppState from '../_helpers/getDefaultAppState';
import validateAppState from '../_helpers/validateAppState';
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
        const isValid = validateAppState(savedValue);

        if (!isValid) {
          return localStorage.removeItem(key);
        }

        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          return localStorage.removeItem(key);
        }

        const nextValue = JSON.stringify(newValue);

        if (validateAppState(nextValue)) {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      });
    },
  ],
});

export default appStateAtom;
