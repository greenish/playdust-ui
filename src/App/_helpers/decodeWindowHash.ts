import { nanoid } from 'nanoid';
import { LocationSensorState } from 'react-use/lib/useLocation';
import { create } from 'superstruct';
import type { WindowStateType } from '../_types/WindowStateType';
import { WindowUnionType } from '../_types/WindowUnionType';
import isInWindowUnion from './isInWindowUnionType';

const decodeWindowHash = (location?: LocationSensorState): WindowStateType => {
  const hash = (location?.hash || '#').slice(1);
  const decoded = decodeURIComponent(hash);
  const pairs = decoded.split('&').map((entry) => entry.split('='));
  const tab = pairs.find(([key]) => key === 'tab')?.[1] || nanoid();
  const [type, state] = pairs.find(([key]) => isInWindowUnion(key)) || ['', ''];

  if (isInWindowUnion(type)) {
    return {
      type: create(type, WindowUnionType),
      state: state || '',
      tabId: tab,
    };
  }

  return {
    type: 'home',
    state: '',
    tabId: tab,
  };
};

export default decodeWindowHash;
