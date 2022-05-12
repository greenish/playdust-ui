import OpenSearchHighlightType from '../../_types/OpenSearchHighlightType';

interface OpenSearchResponseType<T = unknown, A = unknown> {
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
