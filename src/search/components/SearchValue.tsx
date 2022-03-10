import { useRecoilValue } from 'recoil'
import * as store from '../store'
import SearchAttributeNode from './SearchAttributeNode'
import SearchCollectionNode from './SearchCollectionNode'
import SearchTextNode from './SearchTextNode'

interface SearchValueProps {
  id: string
}

const SearchValue = (props: SearchValueProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))

  if (!data) {
    return <></>
  }

  switch (data.field) {
    case 'collection':
      return <SearchCollectionNode id={props.id} />
    case 'attribute':
      return <SearchAttributeNode id={props.id} />
    case 'text':
      return <SearchTextNode id={props.id} />
    default:
      return <></>
  }
}

export default SearchValue
