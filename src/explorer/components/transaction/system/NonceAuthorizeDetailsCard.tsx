import { ParsedInstruction, SystemProgram } from '@solana/web3.js'
import React from 'react'
import { AccountLink } from '../../Links'
import { DataRows, DataRowsItem } from '../../Table'
import { BasicInstructionCard } from '../BasicInstructionCard'
import { InstructionCardProps } from '../InstructionCard'

export function NonceAuthorizeDetailsCard(props: InstructionCardProps) {
  const { ix } = props
  const info = (ix as ParsedInstruction).parsed.info

  const data: DataRowsItem[] = [
    [
      'Program',
      <AccountLink to={SystemProgram.programId.toBase58()} allowCopy />,
    ],
    ['Nonce Address', <AccountLink to={info.nonceAccount} allowCopy />],
    [
      'Old Authority Address',
      <AccountLink to={info.nonceAuthority} allowCopy />,
    ],
    [
      'New Authority Address',
      <AccountLink to={info.newAuthorized} allowCopy />,
    ],
  ]

  return (
    <BasicInstructionCard title="System Program: Authorize Nonce" {...props}>
      <DataRows data={data} />
    </BasicInstructionCard>
  )
}
