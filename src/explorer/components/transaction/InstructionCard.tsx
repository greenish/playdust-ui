import {
  ParsedInstruction,
  ParsedTransaction,
  PartiallyDecodedInstruction,
  SignatureResult,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js'
import { intoTransactionInstruction } from '../../helpers/tx'
import { ErrorCard } from '../ErrorCard'
import { UnknownDetailsCard } from './UnknownDetailsCard'

// These are placeholders for individual detail cards to be built.
// For now, they all default to unknown, which displays hex data
const TokenDetailsCard = UnknownDetailsCard
const BpfLoaderDetailsCard = UnknownDetailsCard
const BpfUpgradeableLoaderDetailsCard = UnknownDetailsCard
const SystemDetailsCard = UnknownDetailsCard
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

export function InstructionCard(props: InstructionCardProps) {
  const { tx, ix, result, index, signature, innerCards, childIndex } = props

  const key = `${index}-${childIndex}`

  if ('parsed' in ix) {
    const props = {
      tx,
      ix,
      result,
      index,
      signature,
      innerCards,
      childIndex,
      key,
    }

    switch (ix.program) {
      case 'spl-token':
        return <TokenDetailsCard {...props} />
      case 'bpf-loader':
        return <BpfLoaderDetailsCard {...props} />
      case 'bpf-upgradeable-loader':
        return <BpfUpgradeableLoaderDetailsCard {...props} />
      case 'system':
        return <SystemDetailsCard {...props} />
      case 'stake':
        return <StakeDetailsCard {...props} />
      case 'spl-memo':
        return <MemoDetailsCard {...props} />
      case 'spl-associated-token-account':
        return <AssociatedTokenDetailsCard {...props} />
      case 'vote':
        return <VoteDetailsCard {...props} />
      default:
        return <UnknownDetailsCard {...props} />
    }
  }

  const transactionIx = intoTransactionInstruction(
    tx,
    ix as PartiallyDecodedInstruction
  )

  if (!transactionIx) {
    return (
      <ErrorCard
        key={key}
        message="Could not display this instruction, please report"
      />
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
    return <BonfidaBotDetailsCard key={key} {...props2} />
  } else if (isInstructionFromAnAnchorProgram(transactionIx)) {
    return <GenericAnchorDetailsCard key={key} {...props2} />
  } else if (isMangoInstruction(transactionIx)) {
    return <MangoDetailsCard key={key} {...props2} />
  } else if (isSerumInstruction(transactionIx)) {
    return <SerumDetailsCard key={key} {...props2} />
  } else if (isTokenSwapInstruction(transactionIx)) {
    return <TokenSwapDetailsCard key={key} {...props2} />
  } else if (isTokenLendingInstruction(transactionIx)) {
    return <TokenLendingDetailsCard key={key} {...props2} />
  } else if (isWormholeInstruction(transactionIx)) {
    return <WormholeDetailsCard key={key} {...props2} />
  } else if (isPythInstruction(transactionIx)) {
    return <PythDetailsCard key={key} {...props2} />
  } else {
    return <UnknownDetailsCard key={key} {...props2} />
  }
}
