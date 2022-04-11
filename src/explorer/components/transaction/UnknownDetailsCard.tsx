import { programLabel } from '../../helpers/tx'
import { useSolanaCluster } from '../../store'
import { BasicInstructionCard } from './BasicInstructionCard'
import { InstructionCardProps } from './InstructionCard'

export function UnknownDetailsCard(props: InstructionCardProps) {
  const { ix } = props

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

  return <BasicInstructionCard {...props} title={title} defaultRaw />
}
