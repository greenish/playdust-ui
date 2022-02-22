import { noWait, selector, useRecoilValue } from 'recoil'
import api from '../helpers/api'
import AttributeResponse from '../types/AttributeResponse'
import searchQueryValid from './searchQueryValid'

const searchAttributes = selector<AttributeResponse>({
  key: 'searchAttributes',
  get: async ({ get }) => {
    const query = get(searchQueryValid)

    const { data } = await api.post<AttributeResponse>('/attributes', query)

    return data
  },
})

let previousValue: AttributeResponse = []

export const useNoWaitSearchAttributes = () => {
  const loadable = useRecoilValue(noWait(searchAttributes))

  if (loadable.state === 'hasValue') {
    previousValue = loadable.contents
  }

  return previousValue
}

export default searchAttributes
