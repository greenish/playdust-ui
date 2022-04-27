import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink, DataRows, DataRowsItem } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function AllocateDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['Account Address', <AccountLink to={info.account} allowCopy />],
    ['Allocated Data Size', <>{info.space} byte(s)</>],
  ]

  return (
    <BasicInstructionCard title="System Program: Allocate Account" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
