import { atom } from 'recoil';
import type SearchQueryType from '../_types/SearchQueryType';

const searchQueryAtom = atom<SearchQueryType>({
  key: 'searchQueryAtom',
  default: {
    rootId: 'group-root',
    nodes: {
      'group-root': {
        id: 'group-root',
        operator: 'or',
        children: ['dape-and', 'degod-and'],
      },
      'dape-and': {
        id: 'dape-and',
        operator: 'and',
        children: ['dape-id', 'nested-dape-or', 'background-blue'],
      },
      'dape-id': {
        id: 'dape-id',
        field: 'collection',
        value: '5c50fbae-d7ff-456f-8f9a-f79cc9396743',
      },
      'background-blue': {
        id: 'background-blue',
        field: 'attribute',
        trait: 'background',
        value: ['blue'],
      },
      'degod-and': {
        id: 'degod-and',
        operator: 'and',
        children: ['degod-id', 'background-green'],
      },
      'degod-id': {
        id: 'degod-id',
        field: 'collection',
        value: '3f96def7-9b95-4af8-886c-dcea80dd37bd',
      },
      'background-green': {
        id: 'background-green',
        field: 'attribute',
        trait: 'background',
        value: ['green'],
      },
      'nested-dape-or': {
        id: 'nested-dape-or',
        operator: 'or',
        children: ['head-spacehelmet', 'deeply-nested-and'],
      },
      'head-spacehelmet': {
        id: 'head-spacehelmet',
        field: 'attribute',
        trait: 'head',
        value: ['space helmet'],
      },
      'deeply-nested-and': {
        id: 'deeply-nested-and',
        operator: 'and',
        children: ['eyes-sunglasses', 'teeth-golden'],
      },
      'eyes-sunglasses': {
        id: 'eyes-sunglasses',
        field: 'attribute',
        trait: 'eyes',
        value: ['sunglasses'],
      },
      'teeth-golden': {
        id: 'teeth-golden',
        field: 'attribute',
        trait: 'teeth',
        value: ['golden'],
      },
    },
  },
});

export default searchQueryAtom;
