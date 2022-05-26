import SearchQueryNodeType from './SearchQueryNodeType';

type SearchQueryType = {
  rootId: string;
  nodes: {
    [nodeId: string]: SearchQueryNodeType;
  };
};

export default SearchQueryType;
