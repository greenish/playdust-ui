import { atom, selector } from 'recoil';
import { is } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import type SearchQueryType from '../_types/SearchQueryType';

const defaultQuery: SearchQueryType = {
  rootId: 'group-root',
  nodes: {
    'group-root': {
      type: 'group',
      id: 'group-root',
      operator: 'or',
      children: ['dape-and', 'degod-and'],
    },
    'dape-and': {
      type: 'group',
      id: 'dape-and',
      operator: 'and',
      children: ['dape-id', 'nested-dape-or', 'background-dape'],
    },
    'dape-id': {
      id: 'dape-id',
      field: 'collection',
      value: '5c50fbae-d7ff-456f-8f9a-f79cc9396743',
    },
    'background-dape': {
      type: 'group',
      id: 'background-dape',
      operator: 'or',
      children: ['background-blue', 'background-green'],
    },
    'background-blue': {
      id: 'background-blue',
      field: 'attribute',
      trait: 'Background',
      value: ['Blue'],
    },
    'background-green': {
      id: 'background-green',
      field: 'attribute',
      trait: 'Background',
      value: ['Green'],
    },
    'degod-and': {
      id: 'degod-and',
      type: 'group',
      operator: 'and',
      children: ['degod-id', 'background-alaska'],
    },
    'degod-id': {
      id: 'degod-id',
      field: 'collection',
      value: '3f96def7-9b95-4af8-886c-dcea80dd37bd',
    },
    'background-alaska': {
      id: 'background-alaska',
      field: 'attribute',
      trait: 'background',
      value: ['Alaska'],
    },
    'nested-dape-or': {
      id: 'nested-dape-or',
      operator: 'and',
      type: 'group',
      children: ['head-spacehelmet', 'deeply-nested-and'],
    },
    'head-spacehelmet': {
      id: 'head-spacehelmet',
      field: 'attribute',
      trait: 'Head',
      value: ["Musketeer's Hat"],
    },
    'deeply-nested-and': {
      type: 'group',
      id: 'deeply-nested-and',
      operator: 'or',
      children: ['eyes-sunglasses', 'teeth-golden'],
    },
    'eyes-sunglasses': {
      id: 'eyes-sunglasses',
      field: 'attribute',
      trait: 'Eyewear',
      value: ['Ape Vipers'],
    },
    'teeth-golden': {
      id: 'teeth-golden',
      field: 'attribute',
      trait: 'Teeth',
      value: ['Gold Tooth'],
    },
  },
};
const searchQueryStorageAtom = atom<SearchQueryType>({
  key: 'searchQueryStorageAtom',
  default: defaultQuery,
});

const searchQueryAtom = selector<SearchQueryType>({
  key: 'searchQueryAtom',
  get: ({ get }) => {
    const searchQuery = get(searchQueryStorageAtom);

    if (!is(searchQuery.nodes[searchQuery.rootId], GroupNodeType)) {
      return defaultQuery;
    }

    return searchQuery;
  },
  set: ({ set }, newValue) => set(searchQueryStorageAtom, newValue),
});

export default searchQueryAtom;
