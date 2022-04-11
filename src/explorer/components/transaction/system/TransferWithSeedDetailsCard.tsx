import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { Copyable } from '../../common/Copyable'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'
import { DataRows, DataRowsItem } from '../../Table'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function TransferWithSeedDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['From Address', <AccountLink to={info.source} allowCopy />],
    ['Destination Address', <AccountLink to={info.destination} allowCopy />],
    ['Base Address', <AccountLink to={info.sourceBase} allowCopy />],
    ['Transfer Amount (SOL)', <SolBalance lamports={info.lamports} />],
    [
      'Seed',
      <Copyable text={info.sourceSeed}>
        <code>{info.sourceSeed}</code>
      </Copyable>,
    ],
    ['Source Owner', <AccountLink to={info.sourceOwner} allowCopy />],
  ]

  return (
    <BasicInstructionCard title="System Program: Transfer w/ Seed" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
