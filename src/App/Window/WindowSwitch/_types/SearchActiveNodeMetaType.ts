type SearchActiveNodeMetaType =
  | {
      type: 'query';
      nodeId: string;
    }
  | {
      type: 'group';
      nodeId: string;
      index: number;
    };

export default SearchActiveNodeMetaType;
