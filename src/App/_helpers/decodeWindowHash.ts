import { nanoid } from 'nanoid';
import { LocationSensorState } from 'react-use/lib/useLocation';
import { create } from 'superstruct';
import type { WindowType } from '../_types/WindowType';
import { WindowUnionType } from '../_types/WindowUnionType';
import isInWindowUnion from './isInWindowUnionType';

const decodeWindowHash = (
  location?: LocationSensorState
): { windowState: WindowType; tab: string } => {
  const hash = (location?.hash ?? window.location.hash).slice(1);

  const decoded = decodeURIComponent(hash);
  const pairs = decoded.split('&').map((entry) => entry.split('='));
  const tab = pairs.find(([key]) => key === 'tab')?.[1] || nanoid();
  const [type, state] = pairs.find(([key]) => isInWindowUnion(key)) || ['', ''];

  if (isInWindowUnion(type)) {
    return {
      windowState: {
        type: create(type, WindowUnionType),
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
