import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import SearchQueryType from '../_types/SearchQueryType';
import insertAtIdx from './insertAtIdx';
import reduceSearchQuery from './reduceSearchQuery';

const addQueryNode = (
  query: SearchQueryType,
  nodeAddition: SearchQueryNodeType,
  parentId: string,
  index: number
): SearchQueryType => {
  const withAddedNodes = {
    ...query,
    nodes: {
      ...query.nodes,
      [nodeAddition.id]: nodeAddition,
    },
  };

  return reduceSearchQuery(withAddedNodes, (node) => {
    if (node.id === parentId && node.type === 'group') {
      return {
        ...node,
        children: insertAtIdx(node.children, nodeAddition.id, index),
      };
    }

    return node;
  });
};

export default addQueryNode;
