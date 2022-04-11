import { Box, Button, Chip } from '@mui/material'
import { SignatureResult, TransactionInstruction } from '@solana/web3.js'
import React, { PropsWithChildren, useState } from 'react'
import { useRawPopulatedTransaction } from '../../store'
import { AccountLink } from '../Links'
import {
  DataCell,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '../Table'
import { InstructionCardProps } from './InstructionCard'
import { RawDetails } from './RawDetails'
import { RawParsedDetails } from './RawParsedDetails'

function ixResult(
  result: SignatureResult,
  index: number
): ['warning' | 'error' | 'success', string?] {
  if (result.err) {
    const err = result.err as any
    const ixError = err['InstructionError']
    if (ixError && Array.isArray(ixError)) {
      const [errorIndex, error] = ixError
      if (Number.isInteger(errorIndex) && errorIndex === index) {
        return ['warning', `Error: ${JSON.stringify(error)}`]
      }
    }
    return ['error']
  }
  return ['success']
}

type BasicInstructionCardProps = InstructionCardProps & {
  title: string
  defaultRaw?: boolean
}

export function BasicInstructionCard(
  props: PropsWithChildren<BasicInstructionCardProps>
) {
  const {
    title,
    defaultRaw,
    ix,
    result,
    index,
    signature,
    innerCards,
    childIndex,
    children,
  } = props

  const [showRaw, setShowRaw] = useState(defaultRaw || false)
  const rawDetails = useRawPopulatedTransaction(signature)

  const rawClickHandler = () => {
    return setShowRaw((r) => !r)
  }

  const [resultColor] = ixResult(result, index)

  let raw: TransactionInstruction | undefined = undefined
  if (rawDetails && childIndex === undefined) {
    raw = rawDetails.transaction.instructions[index]
  }

  const label = `#${index + 1}${
    childIndex !== undefined ? `.${childIndex + 1}` : ''
  }`

  return (
    <Box>
      <div>
        <h3>
          <Chip label={label} color={resultColor} size="small" /> {title}
          <Button disabled={defaultRaw} onClick={rawClickHandler}>
            Raw
          </Button>
        </h3>
      </div>
      <TableContainer>
        <Table>
          <TableBody>
            {showRaw ? (
              <>
                <TableRow>
                  <DataCell>Program</DataCell>
                  <DataCell>
                    <AccountLink to={ix.programId.toBase58()} allowCopy />
                  </DataCell>
                </TableRow>
                {'parsed' in ix ? (
                  <RawParsedDetails ix={ix}>
                    {raw ? <RawDetails ix={raw} /> : null}
                  </RawParsedDetails>
                ) : (
                  <RawDetails ix={ix as TransactionInstruction} />
                )}
              </>
            ) : (
              children
            )}

            {innerCards && innerCards.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Inner Instructions
                  <Box p={3}>{innerCards}</Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
