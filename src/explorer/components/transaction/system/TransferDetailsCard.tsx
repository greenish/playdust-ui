import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink, DataRows, DataRowsItem, SolBalance } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function TransferDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['From Address', <AccountLink to={info.source} allowCopy />],
    ['To Address', <AccountLink to={info.destination} allowCopy />],
    ['Transfer Amount (SOL)', <SolBalance lamports={info.lamports} />],
  ]

  return (
    <BasicInstructionCard title="System Program: Transfer" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
