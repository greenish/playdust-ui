import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink, DataRows, DataRowsItem, SolBalance } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function CreateDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['From Address', <AccountLink to={info.source} allowCopy />],
    ['New Address', <AccountLink to={info.newAccount} allowCopy />],
    ['Transfer Amount (SOL)', <SolBalance lamports={info.lamports} />],
    ['Allocated Data Size', <>{info.space} byte(s)</>],
    ['Assigned Program Id', <AccountLink to={info.owner} allowCopy />],
  ]

  return (
    <BasicInstructionCard {...props} title="System Program: Create Account">
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
