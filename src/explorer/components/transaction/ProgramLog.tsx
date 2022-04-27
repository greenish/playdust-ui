import { Chip, Typography } from '@mui/material'
import { Message, ParsedMessage, PublicKey } from '@solana/web3.js'
import { InstructionLogs, prettyProgramLogs } from '../../helpers/programLog'
import { programLabel } from '../../helpers/tx'
import { useRawTransaction, useSolanaCluster } from '../../store'
import { ExplorerCard, Table, TableBody, TableCell, TableRow } from '../common'

interface ProgramLogProps {
  signature: string
}

const ProgramName = ({ programId }: { programId: PublicKey }) => {
  const { network } = useSolanaCluster()

  let programName

  try {
    programName = programLabel(programId.toBase58(), network)
  } catch (err) {}

  programName = programName || 'Unknown Program'

  return <>{programName}</>
}

interface ProgramLogsCardProps {
  message: Message | ParsedMessage
  logs: InstructionLogs[]
}

export function ProgramLogsCard({ message, logs }: ProgramLogsCardProps) {
  return (
    <Table>
      <TableBody>
        {message.instructions.map((ix, index) => {
          let programId
          if ('programIdIndex' in ix) {
            const programAccount = message.accountKeys[ix.programIdIndex]
            if ('pubkey' in programAccount) {
              programId = programAccount.pubkey
            } else {
              programId = programAccount
            }
          } else {
            programId = ix.programId
          }
          const programLogs: InstructionLogs | undefined = logs[index]

          let badgeColor = 'white'
          if (programLogs) {
            badgeColor = programLogs.failed ? 'warning' : 'success'
          }

          return (
            <TableRow key={index}>
              <TableCell>
                <div>
                  <Chip label={`#${index + 1}`} color="success" size="small" />{' '}
                  <ProgramName programId={programId} /> Instruction
                </div>
                {programLogs && (
                  <div>
                    {programLogs.logs.map((log, key) => {
                      return (
                        <div key={key}>
                          <span className="text-muted">{log.prefix}</span>
                          <span className={`text-${log.style}`}>
                            {log.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

interface ProgramLogProps {
  signature: string
}

export const ProgramLogContent = ({ signature }: ProgramLogProps) => {
  const { network } = useSolanaCluster()
  const tx = useRawTransaction(signature)

  if (!tx) {
    return <div>No data available</div>
  }

  const {
    meta,
    transaction: { message },
  } = tx

  const { logMessages, err } = meta || {}

  const prettyLogs = prettyProgramLogs(logMessages || [], err || null, network)

  return (
    <>
      {prettyLogs !== null ? (
        <ProgramLogsCard message={message} logs={prettyLogs} />
      ) : (
        <div>Logs not supported for this transaction</div>
      )}
    </>
  )
}

export const ProgramLog = (props: ProgramLogProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Typography variant="h5" component="h2" gutterBottom>
        Program Log
      </Typography>
      <ProgramLogContent {...props} />
    </ExplorerCard>
  )
}
