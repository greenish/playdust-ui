import type SearchResponseType from './SearchResponseType';

type SearchCursorResponseType = Pick<SearchResponseType, 'nfts' | 'cursor'>;

export default SearchCursorResponseType;
