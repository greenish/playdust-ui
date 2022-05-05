import makeUseQueryChange from '../_helpers/makeUseQueryChange';

const useSetOnlyListed = makeUseQueryChange<boolean>(
  () => (nextOnlyListed) => ({ onlyListed: nextOnlyListed })
);

export default useSetOnlyListed;
