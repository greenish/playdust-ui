import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'
import { DataRows, DataRowsItem } from '../../Table'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function NonceWithdrawDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['Nonce Address', <AccountLink to={info.nonceAccount} allowCopy />],
    ['Authority Address', <AccountLink to={info.nonceAuthority} allowCopy />],
    ['To Address', <AccountLink to={info.destination} allowCopy />],
    ['Withdraw Amount (SOL)', <SolBalance lamports={info.lamports} />],
  ]

  return (
    <BasicInstructionCard title="System Program: Withdraw Nonce" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
