import { ParsedInstruction } from '@solana/web3.js'
import React, { FunctionComponent } from 'react'
import { InstructionCardProps } from '../InstructionCard'
import { UnknownDetailsCard } from '../UnknownDetailsCard'
import { AllocateDetailsCard } from './AllocateDetailsCard'
import { AllocateWithSeedDetailsCard } from './AllocateWithSeedDetailsCard'
import { AssignDetailsCard } from './AssignDetailsCard'
import { AssignWithSeedDetailsCard } from './AssignWithSeedDetailsCard'
import { CreateDetailsCard } from './CreateDetailsCard'
import { CreateWithSeedDetailsCard } from './CreateWithSeedDetailsCard'
import { NonceAdvanceDetailsCard } from './NonceAdvanceDetailsCard'
import { NonceAuthorizeDetailsCard } from './NonceAuthorizeDetailsCard'
import { NonceInitializeDetailsCard } from './NonceInitializeDetailsCard'
import { NonceWithdrawDetailsCard } from './NonceWithdrawDetailsCard'
import { TransferDetailsCard } from './TransferDetailsCard'
import { TransferWithSeedDetailsCard } from './TransferWithSeedDetailsCard'

interface ComponentDetails {
  component: FunctionComponent<InstructionCardProps>
}

const map: Record<string, ComponentDetails> = {
  createAccount: {
    component: CreateDetailsCard,
  },
  createAccountWithSeed: {
    component: CreateWithSeedDetailsCard,
  },
  allocate: {
    component: AllocateDetailsCard,
  },
  allocateWithSeed: {
    component: AllocateWithSeedDetailsCard,
  },
  assign: {
    component: AssignDetailsCard,
  },
  assignWithSeed: {
    component: AssignWithSeedDetailsCard,
  },
  transfer: {
    component: TransferDetailsCard,
  },
  advanceNonce: {
    component: NonceAdvanceDetailsCard,
  },
  withdrawNonce: {
    component: NonceWithdrawDetailsCard,
  },
  authorizeNonce: {
    component: NonceAuthorizeDetailsCard,
  },
  initializeNonce: {
    component: NonceInitializeDetailsCard,
  },
  transferWithSeed: {
    component: TransferWithSeedDetailsCard,
  },
}

export function SystemDetailsCard(props: InstructionCardProps) {
  const Component =
    map[(props.ix as ParsedInstruction).parsed.type]?.component ||
    UnknownDetailsCard

  return <Component {...props} />
}
