import type OpenSearchCollectionSourceHighlightType from './OpenSearchCollectionSourceHighlightType';

interface ActualHighlightType {
  highlight: string;
  actual: string;
}

interface SearchSuggestionResponseType {
  collections: OpenSearchCollectionSourceHighlightType[];
  attributeNames: ActualHighlightType[];
  attributeValues: ActualHighlightType[];
}

export default SearchSuggestionResponseType;
