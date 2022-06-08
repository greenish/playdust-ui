import SearchQueryType from '../_types/SearchQueryType';
import reduceSearchQuery from './reduceSearchQuery';

const removeQueryNode = (
  query: SearchQueryType,
  removalId: string
): SearchQueryType => {
  const nextQuery = reduceSearchQuery(query, (node) => {
    if (node.id === removalId) {
      return null;
    }

    if (node.type === 'group' && node.children.includes(removalId)) {
      return {
        ...node,
        children: node.children.filter((child) => child !== removalId),
      };
    }

    return node;
  });

  return nextQuery;
};

export default removeQueryNode;
