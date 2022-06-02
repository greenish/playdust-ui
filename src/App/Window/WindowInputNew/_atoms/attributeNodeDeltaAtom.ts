import { atom } from 'recoil';

type AttributeNodeDeltaType = {
  add: boolean;
  key: string;
  meta?: {
    key: string;
    value: string;
  };
}[];

const attributeNodeDeltaAtom = atom<AttributeNodeDeltaType>({
  key: 'attributeNodeDeltaAtom',
  default: [],
});

export default attributeNodeDeltaAtom;
