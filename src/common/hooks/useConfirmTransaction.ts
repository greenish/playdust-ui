import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useTriggerNotfication } from '../../app/store'
import { executeNFTSale } from '../helpers/playdustApi'

const useConfirmTransaction = () => {
  const { publicKey, signTransaction } = useWallet()
  const triggerNotificaiton = useTriggerNotfication()

  return async (dataPromise: Promise<any>, success: string, error: string) => {
    try {
      const data = await dataPromise

      if (signTransaction && publicKey) {
        const transaction = Transaction.from(data?.txBuff)

        await signTransaction(transaction)

        const { txHash } = await executeNFTSale(data, [
          ...new Uint8Array(transaction.serialize()),
        ])

        triggerNotificaiton(success, 'success')

        return txHash
      }
    } catch (e) {
      triggerNotificaiton(error, 'error')
      console.error('transaction failed:', e)
      return
    }
  }
}

export default useConfirmTransaction
