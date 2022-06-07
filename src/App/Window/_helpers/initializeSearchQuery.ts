import { nanoid } from 'nanoid';
import type QueryNodeType from '../_types/QueryNodeType';
import type SearchQueryType from '../_types/SearchQueryType';

const initializeSearchQuery = (node: QueryNodeType): SearchQueryType => {
  const andId = nanoid();

  const nextQuery: SearchQueryType = {
    rootId: andId,
    nodes: {
      [andId]: {
        id: andId,
        type: 'group',
        operator: 'and',
        children: [node.id],
      },
      [node.id]: node,
    },
  };

  return nextQuery;
};

export default initializeSearchQuery;
