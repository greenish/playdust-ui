import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchAttributeNode from './SearchAttributeNode'
import SearchCollectionNode from './SearchCollectionNode'
import SearchRelevanceNode from './SearchRelevanceNode'

interface SearchValueProps {
  id: string
}

const SearchValue = (props: SearchValueProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))

  if (!data) {
    return <></>
  }

  if (data.searchType === 'relevance') {
    return <SearchRelevanceNode id={props.id} />
  }

  switch (data.field) {
    case 'collection':
      return <SearchCollectionNode id={props.id} />
    case 'attribute':
      return <SearchAttributeNode id={props.id} />
    default:
      return <></>
  }
}

export default SearchValue
