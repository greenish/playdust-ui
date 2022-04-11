import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { Copyable } from '../../common/Copyable'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'
import { DataRows, DataRowsItem } from '../../Table'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function CreateWithSeedDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['From Address', <AccountLink to={info.source} allowCopy />],
    ['New Address', <AccountLink to={info.newAccount} allowCopy />],
    ['Base Address', <AccountLink to={info.base} allowCopy />],
    [
      'Seed',
      <Copyable text={info.seed}>
        <code>{info.seed}</code>
      </Copyable>,
    ],
    ['Transfer Amount (SOL)', <SolBalance lamports={info.lamports} />],
    ['Allocated Data Size', <>{info.space} byte(s)</>],
    ['Assigned Program Id', <AccountLink to={info.owner} allowCopy />],
  ]

  return (
    <BasicInstructionCard
      title="System Program: Create Account w/ Seed"
      {...props}
    >
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
