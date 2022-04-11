export interface TokenAmountUi {
  amount: string
  decimals: number
  uiAmountString: string
}

export interface InitializeMint {
  mint: string
  decimals: number
  mintAuthority: string
  rentSysvar: string
  freezeAuthority?: string
}

export interface InitializeAccount {
  account: string
  mint: string
  owner: string
  rentSysvar: string
}

export interface InitializeMultisig {
  multisig: string
  rentSysvar: string
  signers: string[]
  m: number
}

export interface Transfer {
  source: string
  destination: string
  amount: string | number
  authority?: string
  multisigAuthority?: string
  signers?: string
}

export interface Approve {
  source: string
  delegate: string
  amount: string | number
  owner?: string
  multisigOwner?: string
  signers?: string[]
}

export interface Revoke {
  source: string
  owner?: string
  multisigOwner?: string
  signers?: string[]
}

export enum AuthorityType {
  'mintTokens',
  'freezeAccount',
  'accountOwner',
  'closeAccount',
}

export interface SetAuthority {
  mint?: string
  account?: string
  authorityType: AuthorityType
  newAuthority: string | null
  authority?: string
  multisigAuthority?: string
  signers?: string[]
}

export interface MintTo {
  mint: string
  account: string
  amount: string | number
  mintAuthority?: string
  multisigMintAuthority?: string
  signers?: string[]
}

export interface Burn {
  account: string
  mint: string
  amount: string | number
  authority?: string
  multisigAuthority?: string
  signers?: string[]
}

export interface CloseAccount {
  account: string
  destination: string
  owner?: string
  multisigOwner?: string
  signers?: string[]
}

export interface FreezeAccount {
  account: string
  mint: string
  freezeAuthority?: string
  multisigFreezeAuthority?: string
  signers?: string[]
}

export interface ThawAccount {
  account: string
  mint: string
  freezeAuthority?: string
  multisigFreezeAuthority?: string
  signers?: string[]
}

export interface TransferChecked {
  source: string
  mint: string
  destination: string
  authority?: string
  multisigAuthority?: string
  signers?: string[]
  tokenAmount: TokenAmountUi
}

export interface ApproveChecked {
  source: string
  mint: string
  delegate: string
  owner?: string
  multisigOwner?: string
  signers?: string[]
  tokenAmount: TokenAmountUi
}

export interface MintToChecked {
  account: string
  mint: string
  mintAuthority?: string
  multisigMintAuthority?: string
  signers?: string[]
  tokenAmount: TokenAmountUi
}

export interface BurnChecked {
  account: string
  mint: string
  authority?: string
  multisigAuthority?: string
  signers?: string[]
  tokenAmount: TokenAmountUi
}

export interface SyncNative {
  account: string
}

export enum TokenInstructionType {
  'initializeMint',
  'initializeAccount',
  'initializeMultisig',
  'transfer',
  'approve',
  'revoke',
  'setAuthority',
  'mintTo',
  'burn',
  'closeAccount',
  'freezeAccount',
  'thawAccount',
  'transfer2',
  'approve2',
  'mintTo2',
  'burn2',
  'transferChecked',
  'approveChecked',
  'mintToChecked',
  'burnChecked',
  'syncNative',
}

/*
export const IX_STRUCTS = {
  initializeMint: InitializeMint,
  initializeAccount: InitializeAccount,
  initializeMultisig: InitializeMultisig,
  transfer: Transfer,
  approve: Approve,
  revoke: Revoke,
  setAuthority: SetAuthority,
  mintTo: MintTo,
  burn: Burn,
  closeAccount: CloseAccount,
  freezeAccount: FreezeAccount,
  thawAccount: ThawAccount,
  transfer2: TransferChecked,
  approve2: ApproveChecked,
  mintTo2: MintToChecked,
  burn2: BurnChecked,
  transferChecked: TransferChecked,
  approveChecked: ApproveChecked,
  mintToChecked: MintToChecked,
  burnChecked: BurnChecked,
  syncNative: SyncNative,
};
*/

export const IX_TITLES: Record<string, string> = {
  initializeMint: 'Initialize Mint',
  initializeAccount: 'Initialize Account',
  initializeMultisig: 'Initialize Multisig',
  transfer: 'Transfer',
  approve: 'Approve',
  revoke: 'Revoke',
  setAuthority: 'Set Authority',
  mintTo: 'Mint To',
  burn: 'Burn',
  closeAccount: 'Close Account',
  freezeAccount: 'Freeze Account',
  thawAccount: 'Thaw Account',
  transfer2: 'Transfer (Checked)',
  approve2: 'Approve (Checked)',
  mintTo2: 'Mint To (Checked)',
  burn2: 'Burn (Checked)',
  transferChecked: 'Transfer (Checked)',
  approveChecked: 'Approve (Checked)',
  mintToChecked: 'Mint To (Checked)',
  burnChecked: 'Burn (Checked)',
  syncNative: 'Sync Native',
}
