import { atom } from 'recoil';

interface FlaggedType {
  id: string;
  type: 'Collection' | 'NFT' | undefined;
  open: boolean;
}

const flaggedCollectionAtom = atom<FlaggedType>({
  key: 'flaggedCollectionAtom',
  default: {
    open: false,
    id: '',
    type: undefined,
  },
});

export default flaggedCollectionAtom;
