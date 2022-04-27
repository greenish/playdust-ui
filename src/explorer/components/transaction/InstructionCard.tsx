import {
  ParsedInstruction,
  ParsedTransaction,
  PartiallyDecodedInstruction,
  SignatureResult,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { intoTransactionInstruction } from '../../helpers/tx'
import { ErrorCard } from '../common'
import { SystemDetailsCard } from './system/SystemDetailsCard'
import { TokenDetailsCard } from './token/TokenDetailsCard'
import { UnknownDetailsCard } from './UnknownDetailsCard'

// These are placeholders for individual detail cards to be built.
// For now, they all default to unknown, which displays hex data
const BpfLoaderDetailsCard = UnknownDetailsCard
const BpfUpgradeableLoaderDetailsCard = UnknownDetailsCard
const StakeDetailsCard = UnknownDetailsCard
const MemoDetailsCard = UnknownDetailsCard
const AssociatedTokenDetailsCard = UnknownDetailsCard
const VoteDetailsCard = UnknownDetailsCard
const BonfidaBotDetailsCard = UnknownDetailsCard
const GenericAnchorDetailsCard = UnknownDetailsCard
const MangoDetailsCard = UnknownDetailsCard
const SerumDetailsCard = UnknownDetailsCard
const TokenSwapDetailsCard = UnknownDetailsCard
const TokenLendingDetailsCard = UnknownDetailsCard
const WormholeDetailsCard = UnknownDetailsCard
const PythDetailsCard = UnknownDetailsCard

// These will take transactionIx, but for now blank
const isBonfidaBotInstruction = (transactionIx?: any) => false
const isInstructionFromAnAnchorProgram = (transactionIx?: any) => false
const isMangoInstruction = (transactionIx?: any) => false
const isSerumInstruction = (transactionIx?: any) => false
const isTokenSwapInstruction = (transactionIx?: any) => false
const isTokenLendingInstruction = (transactionIx?: any) => false
const isWormholeInstruction = (transactionIx?: any) => false
const isPythInstruction = (transactionIx?: any) => false

export interface InstructionCardProps {
  ix: ParsedInstruction | PartiallyDecodedInstruction | TransactionInstruction
  tx: ParsedTransaction
  result: SignatureResult
  index: number
  signature: TransactionSignature
  innerCards?: JSX.Element[]
  childIndex?: number
}

interface InstructionDetails {
  component: FunctionComponent<InstructionCardProps>
}

export const instructionMap: Record<string, InstructionDetails> = {
  'spl-token': {
    component: TokenDetailsCard,
  },
  'bpf-loader': {
    component: BpfLoaderDetailsCard,
  },
  'bpf-upgradeable-loader': {
    component: BpfUpgradeableLoaderDetailsCard,
  },
  system: {
    component: SystemDetailsCard,
  },
  stake: {
    component: StakeDetailsCard,
  },
  'spl-memo': {
    component: MemoDetailsCard,
  },
  'spl-associated-token-account': {
    component: AssociatedTokenDetailsCard,
  },
  vote: {
    component: VoteDetailsCard,
  },
  unknown: {
    component: UnknownDetailsCard,
  },
}

export function InstructionCard(props: InstructionCardProps) {
  const { tx, ix, result, index, signature, innerCards, childIndex } = props

  if ('parsed' in ix) {
    const props = {
      tx,
      ix,
      result,
      index,
      signature,
      innerCards,
      childIndex,
    }

    const Details = instructionMap[ix.program] || instructionMap['unknown']

    return <Details.component {...props} />
  }

  const transactionIx = intoTransactionInstruction(
    tx,
    ix as PartiallyDecodedInstruction
  )

  if (!transactionIx) {
    return (
      <ErrorCard message="Could not display this instruction, please report" />
    )
  }

  const props2 = {
    ix: transactionIx,
    tx,
    result,
    index,
    signature,
    innerCards,
    childIndex,
  }

  if (isBonfidaBotInstruction(transactionIx)) {
    return <BonfidaBotDetailsCard {...props2} />
  } else if (isInstructionFromAnAnchorProgram(transactionIx)) {
    return <GenericAnchorDetailsCard {...props2} />
  } else if (isMangoInstruction(transactionIx)) {
    return <MangoDetailsCard {...props2} />
  } else if (isSerumInstruction(transactionIx)) {
    return <SerumDetailsCard {...props2} />
  } else if (isTokenSwapInstruction(transactionIx)) {
    return <TokenSwapDetailsCard {...props2} />
  } else if (isTokenLendingInstruction(transactionIx)) {
    return <TokenLendingDetailsCard {...props2} />
  } else if (isWormholeInstruction(transactionIx)) {
    return <WormholeDetailsCard {...props2} />
  } else if (isPythInstruction(transactionIx)) {
    return <PythDetailsCard {...props2} />
  } else {
    return <UnknownDetailsCard {...props2} />
  }
}
