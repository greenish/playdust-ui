import { useResetRecoilState, useSetRecoilState } from 'recoil'
import * as store from '../store'
import type SearchState from '../types/SearchState'

const useUpdateSearch = () => {
  const querySetter = useSetRecoilState(store.searchQuery)
  const sortSetter = useSetRecoilState(store.searchSort)
  const onlyListedSetter = useSetRecoilState(store.searchOnlyListed)

  return ({ query, sort, onlyListed }: Partial<SearchState>) => {
    query && querySetter(query)
    sortSetter(sort)
    onlyListedSetter(onlyListed)
  }
}

export const useResetSearch = () => {
  const queryResetter = useResetRecoilState(store.searchQuery)
  const sortResetter = useResetRecoilState(store.searchSort)
  const onlyListedResetter = useResetRecoilState(store.searchOnlyListed)

  return () => {
    queryResetter()
    sortResetter()
    onlyListedResetter()
  }
}

export default useUpdateSearch
