import { useRouter } from 'next/router';
import encodeWindowHash from '../_helpers/encodeWindowHash';
import getWindowHash from '../_helpers/getWindowHash';
import type EncodeHashOptionsType from '../_types/EncodeHashOptionsType';
import type WindowType from '../_types/WindowType';

const makeUseNavigateWindowHash = (method: 'push' | 'replace') =>
  function useNavWindowHash() {
    const router = useRouter();

    return (input: WindowType, options?: EncodeHashOptionsType) => {
      const encoded = encodeWindowHash(input, options);
      const actual = `/${getWindowHash()}`;
      const didUrlChange = encoded !== actual;

      if (didUrlChange) {
        router[method](encoded);
      }
    };
  };

export default makeUseNavigateWindowHash;
