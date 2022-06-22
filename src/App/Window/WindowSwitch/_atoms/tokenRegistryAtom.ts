import {
  Strategy,
  TokenInfo,
  TokenInfoMap,
  TokenListProvider,
} from '@solana/spl-token-registry';
import { selector } from 'recoil';
import solanaClusterAtom from '../../../_atoms/solanaClusterAtom';

const tokenRegistryAtom = selector<TokenInfoMap>({
  key: 'tokenRegistry',
  get: async ({ get }) => {
    const cluster = get(solanaClusterAtom);
    const tokens = await new TokenListProvider().resolve(Strategy.CDN);
    const tokenList = tokens
      .filterByChainId(cluster.tokenRegistryENV)
      .getList();

    const tokenRegistry = tokenList.reduce(
      (map: TokenInfoMap, item: TokenInfo) => {
        map.set(item.address, item);
        return map;
      },
      new Map()
    );

    return tokenRegistry;
  },
});

export default tokenRegistryAtom;
