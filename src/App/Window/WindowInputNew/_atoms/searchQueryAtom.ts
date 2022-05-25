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
        children: ['group-and', 'degod-id'],
      },
      'group-and': {
        id: 'group-and',
        operator: 'and',
        children: ['dape-id', 'nested-attribute-or', 'background-blue'],
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
      'degod-id': {
        id: 'degod-id',
        field: 'collection',
        value: '3f96def7-9b95-4af8-886c-dcea80dd37bd',
      },
      'nested-attribute-or': {
        id: 'nested-attribute-or',
        operator: 'or',
        children: ['head-spacehelmet', 'eyes-sunglasses'],
      },
      'head-spacehelmet': {
        id: 'head-spacehelmet',
        field: 'attribute',
        trait: 'head',
        value: ['space helmet'],
      },
      'eyes-sunglasses': {
        id: 'eyes-sunglasses',
        field: 'attribute',
        trait: 'eyes',
        value: ['sunglasses'],
      },
    },
  },
});

export default searchQueryAtom;
