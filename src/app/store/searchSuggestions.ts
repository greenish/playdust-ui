import { atom, noWait, selector } from 'recoil'
import frontendApi from '../../common/helpers/frontendApi'
import { CollectionSourceHighlight } from '../../search/types/OpenSearchIndex'
import { SearchSuggestionResponse } from '../../search/types/SearchResponse'
import getWindowType from '../helpers/getWindowType'
import WindowUnion from '../types/WindowUnion'

export const searchSuggestionTerm = atom<string>({
  key: 'searchSuggestionTerm',
  default: '',
})

const fetchSearchSuggestions = selector<SearchSuggestionResponse>({
  key: 'fetchSearchSuggestions',
  get: async ({ get }) => {
    const term = get(searchSuggestionTerm)
    const { data } = await frontendApi.post<SearchSuggestionResponse>(
      '/search-suggestions',
      {
        term,
      }
    )

    return data
  },
})

const getHighlight = ({ highlight }: CollectionSourceHighlight) => {
  const highlightArray =
    highlight['description'] || highlight['name'] || highlight['symbol']

  if (highlightArray) {
    return highlightArray[0]
  }

  return ''
}

export interface SearchSuggestion {
  key: string
  type: WindowUnion
  group:
    | 'Search'
    | 'Explorer'
    | 'Collections'
    | 'Attribute Value'
    | 'Attribute Category'
  label: string
  highlight?: string
  meta?: string
}

interface SearchSuggetionResults {
  suggestions: SearchSuggestion[]
  loading: boolean
}

const defaultSuggestions = {
  suggestions: [],
  loading: false,
}

export const searchSuggestions = selector<SearchSuggetionResults>({
  key: 'searchSuggestions',
  get: ({ get }) => {
    const term = get(searchSuggestionTerm)

    if (term === '') {
      return defaultSuggestions
    }

    const { state, contents } = get(noWait(fetchSearchSuggestions))
    const results = state === 'hasValue' ? contents : []

    if (!results) {
      return defaultSuggestions
    }

    const windowType = getWindowType(term)
    const suggestions: SearchSuggestion[] = []

    const addSuggestion = (newSuggestion: SearchSuggestion) =>
      suggestions.push(newSuggestion)

    if (windowType === 'block' || windowType === 'epoch') {
      addSuggestion({
        key: 'block-search',
        group: 'Explorer',
        label: 'block',
        type: 'block',
      })
      addSuggestion({
        key: 'epoch-search',
        group: 'Explorer',
        label: 'epoch',
        type: 'epoch',
      })
    }

    if (windowType === 'account') {
      addSuggestion({
        key: 'account-search',
        group: 'Explorer',
        label: 'account',
        type: 'account',
      })

      return {
        suggestions,
        loading: false,
      }
    }

    if (windowType === 'tx') {
      addSuggestion({
        key: 'transaction-search',
        group: 'Explorer',
        label: 'transaction',
        type: 'tx',
      })

      return {
        suggestions,
        loading: false,
      }
    }

    addSuggestion({
      key: 'fuzzy-search',
      group: 'Search',
      label: 'search for',
      type: 'search',
    })

    if (state === 'hasValue' && contents) {
      const { collections, attributes } = contents as SearchSuggestionResponse

      collections.map((collection) =>
        addSuggestion({
          key: collection.source.id,
          group: 'Collections',
          label: collection.source.name || collection.source.symbol,
          highlight: getHighlight(collection),
          type: 'search',
          meta: collection.source.id,
        })
      )

      attributes.names.map((attributeName) =>
        addSuggestion({
          key: `attributeValue:${attributeName}`,
          group: 'Attribute Category',
          label: 'has',
          highlight: attributeName,
          meta: attributeName.replace('<em>', '').replace('</em>', ''),
          type: 'search',
        })
      )

      attributes.values.map((attributeValue) =>
        addSuggestion({
          key: `attributeName:${attributeValue}`,
          group: 'Attribute Value',
          label: 'equals',
          highlight: attributeValue,
          meta: attributeValue.replace('<em>', '').replace('</em>', ''),
          type: 'search',
        })
      )
    }

    return {
      suggestions,
      loading: state === 'loading',
    }
  },
})
