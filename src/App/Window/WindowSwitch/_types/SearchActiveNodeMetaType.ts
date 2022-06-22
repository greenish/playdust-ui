type SearchActiveNodeMetaType =
  | {
      type: 'query';
      nodeId: string;
    }
  | {
      type: 'group';
      nodeId: string;
      index: number;
      endIndex?: number;
      isGroupSelected?: boolean;
    };

export default SearchActiveNodeMetaType;
