import makeUseQueryChange from '../_helpers/makeUseQueryChange'

const useSetOnlyListed = makeUseQueryChange<boolean>(() => (nextOnlyListed) => {
  return { onlyListed: nextOnlyListed }
})

export default useSetOnlyListed
