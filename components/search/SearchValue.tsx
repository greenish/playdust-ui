import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchAttribute from './SearchAttribute'
import SearchCollection from './SearchCollection'
import SearchRelevance from './SearchRelevance'

interface SearchValueProps {
  id: string
}

const SearchValue = (props: SearchValueProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))

  if (!data) {
    return <></>
  }

  if (data.searchType === 'relevance') {
    return <SearchRelevance id={props.id} />
  }

  switch (data.field) {
    case 'collection':
      return <SearchCollection id={props.id} />
    case 'attribute':
      return <SearchAttribute id={props.id} />
    default:
      return <></>
  }
}

export default SearchValue
