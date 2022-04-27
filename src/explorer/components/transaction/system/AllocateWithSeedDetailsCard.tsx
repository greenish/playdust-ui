import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink, Copyable, DataRows, DataRowsItem } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function AllocateWithSeedDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['Account Address', <AccountLink to={info.account} allowCopy />],
    ['Base Address', <AccountLink to={info.base} allowCopy />],
    [
      'Seed',
      <Copyable text={info.seed}>
        <code>{info.seed}</code>
      </Copyable>,
    ],
    ['Allocated Data Size', <>{info.space} byte(s)</>],
    ['Assigned Program Id', <AccountLink to={info.owner} allowCopy />],
  ]

  return (
    <BasicInstructionCard
      title="System Program: Allocate Account w/ Seed"
      {...props}
    >
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
