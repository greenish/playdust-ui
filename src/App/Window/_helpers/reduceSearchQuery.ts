import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchQueryType from '../_types/SearchQueryType';

const reduceSearchQuery = (
  query: SearchQueryType,
  updateNode: (node: SearchQueryNodeType) => SearchQueryNodeType | null
): SearchQueryType => ({
  ...query,
  nodes: Object.entries(query.nodes).reduce((acc, curr) => {
    const updatedNode = updateNode(curr[1]);

    if (updatedNode === null) {
      return acc;
    }

    return {
      ...acc,
      [updatedNode.id]: updatedNode,
    };
  }, {}),
});

export default reduceSearchQuery;
