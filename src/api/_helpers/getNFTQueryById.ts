import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import SearchQueryType from '../../App/Window/WindowInputNew/_types/SearchQueryType';
import createSingleNFTQuery from './createSingleNFTQuery';

const getNFTQueryById = (
  query: SearchQueryType,
  currId: string
): QueryDslQueryContainer => {
  const currNode = query.nodes[currId];

  if (currNode.type === 'group') {
    const childrenQueries = currNode.children.map((entry) =>
      getNFTQueryById(query, entry)
    );
    const bool =
      currNode.operator === 'and'
        ? {
            must: childrenQueries,
          }
        : {
            should: childrenQueries,
            minimum_should_match: 1,
          };

    return {
      bool,
    };
  }

  return createSingleNFTQuery(currNode);
};

export default getNFTQueryById;
