import { nanoid } from 'nanoid';
import type WindowType from '../_types/WindowType';
import getWindowHash from './getWindowHash';
import isInWindowUnion from './isInWindowUnionType';

const decodeWindowHash = (
  input?: string
): { windowState: WindowType; tab: string } => {
  const hash = (input || getWindowHash()).slice(1);
  const decoded = decodeURIComponent(hash);
  const pairs = decoded.split('&').map((entry) => entry.split('='));
  const tab = pairs.find(([key]) => key === 'tab')?.[1] || nanoid();
  const [type, state] = pairs.find(([key]) => isInWindowUnion(key)) || ['', ''];

  if (isInWindowUnion(type)) {
    return {
      windowState: {
        type,
        state: state || '',
      },
      tab,
    };
  }

  return {
    windowState: {
      type: 'home',
      state: '',
    },
    tab,
  };
};

export default decodeWindowHash;
