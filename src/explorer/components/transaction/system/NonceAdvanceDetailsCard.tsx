import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink, DataRows, DataRowsItem } from '../../common'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function NonceAdvanceDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['Nonce Address', <AccountLink to={info.nonceAccount} allowCopy />],
    ['Authority Address', <AccountLink to={info.nonceAuthority} allowCopy />],
  ]

  return (
    <BasicInstructionCard title="System Program: Advance Nonce" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
