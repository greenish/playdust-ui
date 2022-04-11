import { Stack, Typography } from '@mui/material'
import {
  ParsedInnerInstruction,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
} from '@solana/web3.js'
import React from 'react'
import {
  useParsedConfirmedTransaction,
  useTransactionStatus,
} from '../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import { InstructionCard } from './InstructionCard'

interface InstructionDetailsProps {
  signature: string
}

export const InstructionDetailsContent = ({
  signature,
}: InstructionDetailsProps) => {
  const tx = useParsedConfirmedTransaction(signature)
  const status = useTransactionStatus(signature)

  if (!tx || !status?.info) {
    return <div>No data available</div>
  }

  const { transaction, meta } = tx

  const {
    message: { instructions },
  } = transaction

  if (transaction.message.instructions.length === 0) {
    return <ErrorCard message="No instructions found" />
  }

  const innerInstructions: {
    [index: number]: (ParsedInstruction | PartiallyDecodedInstruction)[]
  } = {}

  if (meta?.innerInstructions) {
    meta.innerInstructions.forEach((parsed: ParsedInnerInstruction) => {
      if (!innerInstructions[parsed.index]) {
        innerInstructions[parsed.index] = []
      }

      parsed.instructions.forEach((ix) => {
        innerInstructions[parsed.index].push(ix)
      })
    })
  }

  const result = status.info.result

  const content = instructions.map((instruction, idx) => {
    let innerCards: JSX.Element[] = []

    if (idx in innerInstructions) {
      innerInstructions[idx].forEach((ix, childIndex) => {
        if (typeof ix.programId === 'string') {
          ix.programId = new PublicKey(ix.programId)
        }

        const key = `${idx}-${childIndex}`

        const card = (
          <InstructionCard
            key={key}
            index={idx}
            ix={ix}
            result={result}
            signature={signature}
            tx={transaction}
            childIndex={childIndex}
          />
        )

        innerCards.push(card)
      })
    }

    const key = `${idx}`

    return (
      <InstructionCard
        key={key}
        index={idx}
        ix={instruction}
        result={result}
        signature={signature}
        tx={transaction}
        innerCards={innerCards}
      />
    )
  })

  return <Stack spacing={2}>{content}</Stack>
}

export const InstructionDetails = (props: InstructionDetailsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Typography variant="h5" component="h2" gutterBottom>
        Instruction Details
      </Typography>
      <InstructionDetailsContent {...props} />
    </ExplorerCard>
  )
}
