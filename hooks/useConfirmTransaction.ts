import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useTriggerNotfication } from '../store'

const useConfirmTransaction = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const triggerNotificaiton = useTriggerNotfication()

  return async (
    dataPromise: Promise<Buffer>,
    success: string,
    error: string
  ) => {
    try {
      const data = await dataPromise

      if (signTransaction && publicKey) {
        const transaction = Transaction.from(data)

        await signTransaction(transaction)

        const signature = await connection.sendRawTransaction(
          transaction.serialize(),
          { skipPreflight: true }
        )

        const result = await connection.confirmTransaction(
          signature,
          'processed'
        )

        if (result.value.err === null) {
          triggerNotificaiton(success, 'success')
        } else {
          triggerNotificaiton(error, 'error')
        }

        return result
      }
    } catch (e) {
      console.error('transaction failed:', e)
      return
    }
  }
}

export default useConfirmTransaction
