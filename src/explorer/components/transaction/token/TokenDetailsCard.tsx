import {
  ParsedAccountData,
  ParsedInstruction,
  PublicKey,
} from '@solana/web3.js'
import React from 'react'
import isAccount from '../../../helpers/isAccount'
import normalizeTokenAmount from '../../../helpers/normalizeTokenAmount'
import { useAccountInfo, useTokenRegistry } from '../../../store'
import { AccountLink, DataRows, DataRowsItem } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'
import { IX_TITLES, TokenAmountUi } from './types'

export function TokenDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const parsed = (ix as ParsedInstruction).parsed

  const { type: rawType, info } = parsed

  const { mintAddress, tokenAddress } = React.useMemo(() => {
    let mintAddress: PublicKey | undefined
    let tokenAddress: PublicKey | undefined

    // No sense fetching accounts if we don't need to convert an amount
    if (!('amount' in info)) return {}

    if ('mint' in info) {
      //  && info.mint instanceof PublicKey) {
      mintAddress = new PublicKey(info.mint) // .toBase58();
    } else if (
      'account' in info // && info.account instanceof PublicKey
    ) {
      tokenAddress = new PublicKey(info.account) // .toBase58();
    } else if (
      'source' in info // && info.source instanceof PublicKey
    ) {
      tokenAddress = new PublicKey(info.source) // .toBase58();
    }
    return {
      mintAddress,
      tokenAddress,
    }
  }, [])

  const tokenAccountInfo = useAccountInfo(tokenAddress)
  const mintAccountInfo = useAccountInfo(mintAddress)

  const tokenRegistry = useTokenRegistry()

  const title = `Token Program: ${IX_TITLES[rawType]}`

  const attributes: DataRowsItem[] = []
  const mintInfo = (mintAccountInfo?.data as ParsedAccountData)?.parsed?.info
  let decimals = mintInfo?.decimals
  let tokenSymbol = ''

  if ('tokenAmount' in info) {
    decimals = info.tokenAmount.decimals
  }

  if (mintAddress) {
    const tokenDetails = tokenRegistry.get(mintAddress)

    if (tokenDetails) {
      tokenSymbol = tokenDetails.symbol
    }

    attributes.push([
      'Token',
      <AccountLink to={mintAddress.toBase58()} allowCopy />,
    ])
  }

  for (let key in info) {
    let value = info[key]
    if (value === undefined) continue

    // Flatten lists of public keys
    if (Array.isArray(value) && value.every((v) => isAccount(v))) {
      for (let i = 0; i < value.length; i++) {
        let publicKey = value[i]
        let label = `${key.charAt(0).toUpperCase() + key.slice(1)} - #${i + 1}`

        attributes.push([label, <AccountLink to={publicKey} allowCopy />])
      }
      continue
    }

    if (key === 'tokenAmount') {
      key = 'amount'
      value = (value as TokenAmountUi).amount
    }

    let tag
    let labelSuffix = ''
    if (isAccount(value)) {
      tag = <AccountLink to={value} allowCopy />
    } else if (key === 'amount') {
      let amount
      if (decimals === undefined) {
        labelSuffix = ' (raw)'
        amount = new Intl.NumberFormat('en-US').format(value)
      } else {
        amount = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(normalizeTokenAmount(value, decimals))
      }
      tag = (
        <>
          {amount} {tokenSymbol}
        </>
      )
    } else {
      tag = <>{value}</>
    }

    let label = key.charAt(0).toUpperCase() + key.slice(1) + labelSuffix

    attributes.push([label, tag])
  }

  return (
    <BasicInstructionCard title={title} {...props}>
      <DataRows data={attributes} />
    </BasicInstructionCard>
  )
}
