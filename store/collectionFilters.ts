import {
  atom,
  useRecoilCallback,
} from 'recoil'
import collectionCursor from './collectionCursor'

export type CollectionFilterType = {
  trait: string
  options: string[]
}

const collectionFilters = atom<CollectionFilterType[]>({
  key: 'collectionFilters',
  default: [],
})

export const useUpdateCollectionFilters = () => {
  const callback = useRecoilCallback(({ reset, set, snapshot }) =>
    async (trait: string, options: string[]) => {
      const filters = await snapshot.getPromise(collectionFilters)

      if (!options.length) {
        const nextFilters = filters.filter(entry =>
          entry.trait !== trait,
        )

        set(collectionFilters, nextFilters)
        reset(collectionCursor)

        return
      }

      const found = filters.find(entry => entry.trait === trait)
      const nextFilters = found ? (
        filters.map(entry => {
          if (entry.trait !== trait) {
            return entry
          }

          return {
            ...entry,
            options,
          }
        })
      ) : (
        [
          ...filters,
          {
            trait,
            options,
          }
        ]
      )

      set(collectionFilters, nextFilters)
      reset(collectionCursor)
    }
  , [])

  return callback
}

export const useSetCollectionFilter = () => {
  const updateFilters = useUpdateCollectionFilters()
  const callback = useRecoilCallback(({ snapshot }) =>
    async (trait: string, option: string, nextValue: boolean) => {
      const filters = await snapshot.getPromise(collectionFilters)
      const found = filters.find(entry => entry.trait === trait)

      if (found) {
        return nextValue
          ? updateFilters(trait, [...found.options, option])
          : updateFilters(trait, found.options.filter(entry => entry !== option))
      }

      updateFilters(trait, [option])
    }
  , [])

  return callback
}

export default collectionFilters
