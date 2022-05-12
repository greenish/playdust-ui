import { atom } from 'recoil';
import StatusEnum from '../../../_types/StatusEnumType';

const collectionStatusAtom = atom<StatusEnum>({
  key: 'collectionStatusAtom',
  default: 0,
});

export default collectionStatusAtom;
