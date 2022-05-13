import OpenSearchHighlightType from '../../_types/OpenSearchHighlightType';

interface OpenSearchResponseType<T = void, A = void> {
  _scroll_id: string;
  hits: {
    total: {
      value: number;
    };
    hits: {
      _id: string;
      _source: T;
      highlight: OpenSearchHighlightType;
    }[];
  };
  aggregations: A;
}

export default OpenSearchResponseType;
