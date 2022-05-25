import axios from 'axios';
import { selector } from 'recoil';
import { assert } from 'superstruct';
import addressStateAtom from '../../../../_atoms/addressStateAtom';
import tokenRegistryAtom from '../../../../_atoms/tokenRegistryAtom';
import safePubkeyString from '../../../../_helpers/safePubkeyString';
import CoinFullInfoType from '../_types/CoinFullInfoType';

const coinGeckoApiBaseUrl = 'https://api.coingecko.com/api/v3';

async function fetchCoinGecko(coin: string) {
  const url = `${coinGeckoApiBaseUrl}/coins/${coin}`;

  const resp = await axios.get<CoinFullInfoType>(url);

  assert(resp.data, CoinFullInfoType);

  return resp.data;
}

const coinGeckoAtom = selector<CoinFullInfoType | undefined>({
  key: 'coinGecko',
  get: async ({ get }) => {
    const addressState = get(addressStateAtom);
    const tokenRegistry = get(tokenRegistryAtom);

    const { pubkey } = addressState;

    const tokenInfo = tokenRegistry.get(safePubkeyString(pubkey));

    if (tokenInfo?.extensions?.coingeckoId) {
      return fetchCoinGecko(tokenInfo.extensions.coingeckoId);
    }

    return undefined;
  },
});

export default coinGeckoAtom;
