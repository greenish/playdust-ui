import { atom } from 'recoil';
import StatusEnum from '../../_types/StatusEnumType';

const collectionStatus = atom<StatusEnum>({
  key: 'collectionStatus',
  default: 0,
});

export default collectionStatus;
