export interface CreateAccountInfo {
  source: string
  newAccount: string
  lamports: number
  space: number
  owner: string
}

export interface AssignInfo {
  account: string
  owner: string
}

export interface TransferInfo {
  source: string
  destination: string
  lamports: number
}

export interface CreateAccountWithSeedInfo {
  source: string
  newAccount: string
  base: string
  seed: string
  lamports: number
  space: number
  owner: string
}

export interface AdvanceNonceInfo {
  nonceAccount: string
  nonceAuthority: string
}

export interface WithdrawNonceInfo {
  nonceAccount: string
  destination: string
  nonceAuthority: string
  lamports: number
}

export interface InitializeNonceInfo {
  nonceAccount: string
  nonceAuthority: string
}

export interface AuthorizeNonceInfo {
  nonceAccount: string
  nonceAuthority: string
  newAuthorized: string
}

export interface AllocateInfo {
  account: string
  space: number
}

export interface AllocateWithSeedInfo {
  account: string
  base: string
  seed: string
  space: number
  owner: string
}

export interface AssignWithSeedInfo {
  account: string
  base: string
  seed: string
  owner: string
}

export interface TransferWithSeedInfo {
  source: string
  sourceBase: string
  destination: string
  lamports: number
  sourceSeed: string
  sourceOwner: string
}

export enum SystemInstructionType {
  'createAccount',
  'createAccountWithSeed',
  'allocate',
  'allocateWithSeed',
  'assign',
  'assignWithSeed',
  'transfer',
  'advanceNonce',
  'withdrawNonce',
  'authorizeNonce',
  'initializeNonce',
  'transferWithSeed',
}
