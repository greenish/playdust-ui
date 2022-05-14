import { TokenInfo, TokenInfoMap, TokenList } from '@solana/spl-token-registry';
import axios from 'axios';
import { selector } from 'recoil';

const tokenRegistryUrl =
  'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json';

const tokenRegistryAtom = selector<TokenInfoMap>({
  key: 'tokenRegistryAtom',
  get: async () => {
    const resp = await axios.get<TokenList>(tokenRegistryUrl);
    const tokenList = resp.data.tokens ?? [];

    const tokenRegistryMap = tokenList.reduce(
      (map: TokenInfoMap, item: TokenInfo) => {
        map.set(item.address, item);
        return map;
      },
      new Map()
    );

    return tokenRegistryMap;
  },
});

export default tokenRegistryAtom;
