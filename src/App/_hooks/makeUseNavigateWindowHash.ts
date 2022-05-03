import { useRouter } from 'next/router'
import { WindowType } from '../_atoms/appState'
import type { EncodeHashOptionsType } from '../_helpers/encodeWindowHash'
import encodeWindowHash from '../_helpers/encodeWindowHash'
import getWindowHash from '../_helpers/getWindowHash'

const makeUseNavWindowHash = (method: 'push' | 'replace') =>
  function useNavWindowHash() {
    const router = useRouter()

    return (input: WindowType, options?: EncodeHashOptionsType) => {
      const encoded = encodeWindowHash(input, options)
      const actual = `/${getWindowHash()}`
      const didUrlChange = encoded !== actual

      if (didUrlChange) {
        router[method](encoded)
      }
    }
  }

export default makeUseNavWindowHash
