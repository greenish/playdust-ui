import {
  ConfirmedSignatureInfo,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import type WindowType from '../../App/_types/WindowType'
import currentState from '../../App/Window/_atoms/currentStateAtom'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'
import { fetchParsedConfirmedTransaction, fetchSignaturesForAddress } from "."

interface TransactionResults {
  signatures: ConfirmedSignatureInfo[]
  transactions: (TransactionResponse | null)[]
  cursor?: string
}

const defaultResponse: TransactionResults = {
  signatures: [],
  transactions: [],
  cursor: undefined,
}

const fetchSignaturesAndTransactions = async (
  endpoint: string,
  pubkey: PublicKey,
  cursor?: string
) => {
  if (!endpoint || !pubkey) {
    return defaultResponse
  }

  const signatures = await fetchSignaturesForAddress(endpoint, pubkey, cursor)

  const transactions = await Promise.all(
    signatures.map((signature) => fetchParsedConfirmedTransaction(endpoint, signature.signature))
  )

  return {
    signatures,
    transactions,
    cursor: signatures[signatures.length - 1].signature,
  }
}

export const explorerStateSelector = selector<WindowType | undefined>({
  key: 'explorerState',
  get: ({ get }) => get(currentState),
})

const transactionResultsBaseSelector = selector<any>({
  key: 'transactionResultsBase',
  get: async ({ get }) => {
    try {
      const explorerState = get(explorerStateSelector)

      if (!explorerState || explorerState.type !== 'address') {
        return []
      }

      const { endpoint } = get(solanaClusterAtom)
      const pubkey = new PublicKey(explorerState.state)

      return await fetchSignaturesAndTransactions(endpoint, pubkey)
    } catch (err: any) {
      return defaultResponse
    }
  },
})

const transactionResultsMoreSelector = atom<any>({
  key: 'transactionResultsMore',
  default: defaultResponse,
})

export const transactionResultsSelector = selector<any>({
  key: 'transactionResults',
  get: ({ get }) => {
    const base = get(transactionResultsBaseSelector)
    const more = get(transactionResultsMoreSelector)

    const cursor = more.cursor || base.cursor

    return {
      signatures: [...base.signatures, ...more.signatures],
      transactions: [...base.transactions, ...more.transactions],
      cursor,
    }
  },
})

export const useFetchMoreTransactions = () => {
  const { endpoint } = useRecoilValue(solanaClusterAtom)
  const explorerState = useRecoilValue(explorerStateSelector)
  const loadable = useRecoilValueLoadable(transactionResultsSelector)
  const setter = useSetRecoilState(transactionResultsMoreSelector)

  return async () => {
    if (loadable.state === 'hasValue') {
      const { cursor } = loadable.contents

      if (!explorerState || explorerState.type !== 'address') {
        return []
      }

      const pubkey = new PublicKey(explorerState.state)

      const res = await fetchSignaturesAndTransactions(endpoint, pubkey, cursor)

      setter((curr: TransactionResults) => ({
          signatures: [...curr.signatures, ...res.signatures],
          transactions: [...curr.transactions, ...res.transactions],
          cursor: res.cursor,
        }))
    }
  }
}

export const useTransactionsResults = () =>
  useRecoilValue(transactionResultsSelector)
