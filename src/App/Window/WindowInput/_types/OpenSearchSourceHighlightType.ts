import OpenSearchHighlightType from './OpenSearchHighlightType';

interface OpenSearchSourceHighlightType<T> {
  source: T;
  highlight: OpenSearchHighlightType;
}

export default OpenSearchSourceHighlightType;
