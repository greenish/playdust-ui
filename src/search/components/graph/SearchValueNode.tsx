import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchAttributeNode from './AttributeNode'
import SearchCollectionNode from './CollectionNode'
import RangeNode from './RangeNode'
import SearchTextNode from './SearchTextNode'

interface SearchValueNodeProps {
  id: string
}

const SearchValueNode = (props: SearchValueNodeProps) => {
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
    case 'range':
      return <RangeNode id={props.id} />
    default:
      const n: never = data

      return n
  }
}

export default SearchValueNode
