type SearchQueryActiveNodeType =
  | {
      type: 'query';
      nodeId: string;
    }
  | {
      type: 'group';
      nodeId: string;
      index: number;
    };

export default SearchQueryActiveNodeType;
