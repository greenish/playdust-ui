import GroupNodeType from './GroupNodeType';
import SearchQueryNodeType from './SearchQueryNodeType';

type SearchQueryType = {
  rootNode: GroupNodeType;
  nodes: {
    [nodeId: string]: SearchQueryNodeType;
  };
};

export default SearchQueryType;
