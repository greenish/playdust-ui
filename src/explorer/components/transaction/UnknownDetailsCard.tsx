import { Box, Chip } from '@mui/material'
import { SignatureResult, TransactionInstruction } from '@solana/web3.js'
import { programLabel } from '../../helpers/tx'
import { useRawPopulatedTransaction, useSolanaCluster } from '../../store'
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

export function UnknownDetailsCard(props: InstructionCardProps) {
  const { ix, tx, result, index, signature, innerCards, childIndex } = props

  const { network } = useSolanaCluster()

  let programId
  let programName

  try {
    programId = ix.programId.toBase58()
    programName = programLabel(programId, network)
  } catch (err) {}

  programId = programId || '??'
  programName = programName || 'Unknown Program'

  const title = `${programName}: Unknown Instruction`

  const [resultColor] = ixResult(result, index)
  const rawDetails = useRawPopulatedTransaction(signature)

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
        </h3>
      </div>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <DataCell>Program</DataCell>
              <DataCell>
                <AccountLink to={programId} />
              </DataCell>
            </TableRow>
            {'parsed' in ix ? (
              <RawParsedDetails ix={ix}>
                {raw ? <RawDetails ix={raw} /> : null}
              </RawParsedDetails>
            ) : (
              <RawDetails ix={ix as TransactionInstruction} />
            )}
            {innerCards && innerCards.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  Inner Instructions
                  <div className="inner-cards">{innerCards}</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
