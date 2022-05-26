import { atom } from 'recoil';

type SearchQueryActiveNodeType =
  | {
      type: 'query';
      nodeId: string;
    }
  | {
      type: 'group';
      nodeId: string;
      index: number;
    };

const searchQueryActiveNodeAtom = atom<SearchQueryActiveNodeType | null>({
  key: 'searchQueryActiveNodeAtom',
  default: null,
});

export default searchQueryActiveNodeAtom;
