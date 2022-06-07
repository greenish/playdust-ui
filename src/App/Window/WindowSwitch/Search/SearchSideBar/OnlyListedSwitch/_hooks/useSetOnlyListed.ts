import makeUseQueryChange from '../../_hooks/makeUseQueryChange';

const useSetOnlyListed = makeUseQueryChange<boolean>(
  () => (nextOnlyListed) => ({ onlyListed: nextOnlyListed })
);

export default useSetOnlyListed;
