import OpenSearchHighlightType from '../../App/Window/WindowInput/_types/OpenSearchHighlightType';

interface OpenSearchResponseType<T = void, A = void> {
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
