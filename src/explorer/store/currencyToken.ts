import { atom, selector } from 'recoil'
import { ListPaymentTokens } from '../../App/_helpers/playdustApi'

export type CurrencyToken = {
  auctionHouseKey: string
  tokenSymbol: string
}

export const currency = atom<string>({
  key: 'currency',
  default: 'SOL',
})

export const allCurrencies = selector<CurrencyToken[]>({
  key: 'allCurrencies',
  get: async () => {
    const response = await ListPaymentTokens()
    if (response.name === 'Error')
      return [
        {
          auctionHouseKey: 'AXT22CtoqLUXHqJKBp5Bgz6zWFaWuFypLKBCTv5p6LbW',
          tokenSymbol: 'SOL',
        },
      ]
    return response
  },
})

export const currencyToken = selector<CurrencyToken>({
  key: 'currencyToken',
  get: ({ get }) => {
    const all = get(allCurrencies)
    const response = all.find(
      (e: CurrencyToken) => e.tokenSymbol === get(currency)
    )
    return response as CurrencyToken
  },
})
