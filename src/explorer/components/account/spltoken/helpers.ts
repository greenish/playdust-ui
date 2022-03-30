import {
  ParsedConfirmedTransaction,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
} from '@solana/web3.js'

export type MintDetails = {
  decimals: number
  mint: string
}

export interface InstructionItem {
  instruction: ParsedInstruction | PartiallyDecodedInstruction
  inner: (ParsedInstruction | PartiallyDecodedInstruction)[]
}

export interface TokenAmountUi {
  amount: string // string(),
  decimals: number // number(),
  uiAmountString: string // string(),
}

export type TokenInstructionType =
  | 'initializeMint'
  | 'initializeAccount'
  | 'initializeMultisig'
  | 'transfer'
  | 'approve'
  | 'revoke'
  | 'setAuthority'
  | 'mintTo'
  | 'burn'
  | 'closeAccount'
  | 'freezeAccount'
  | 'thawAccount'
  | 'transfer2'
  | 'approve2'
  | 'mintTo2'
  | 'burn2'
  | 'transferChecked'
  | 'approveChecked'
  | 'mintToChecked'
  | 'burnChecked'

export interface Transfer {
  source: string // PublicKeyFromString,
  destination: string // PublicKeyFromString,
  amount: string | number // union([string(), number()]),
  authority?: string // optional(PublicKeyFromString),
  multisigAuthority?: string // optional(PublicKeyFromString),
  signers?: string[] // optional(array(PublicKeyFromString)),
}

export interface TransferChecked {
  source: string // PublicKeyFromString,
  mint: string // PublicKeyFromString,
  destination: string // PublicKeyFromString,
  authority?: string // optional(PublicKeyFromString),
  multisigAuthority?: string // optional(PublicKeyFromString),
  signers?: string[] // optional(array(PublicKeyFromString)),
  tokenAmount: TokenAmountUi
}

export function extractMintDetails(
  parsedTransaction: ParsedConfirmedTransaction,
  mintMap: Map<string, MintDetails>
) {
  if (parsedTransaction.meta?.preTokenBalances) {
    parsedTransaction.meta.preTokenBalances.forEach((balance) => {
      const account =
        parsedTransaction.transaction.message.accountKeys[balance.accountIndex]
      mintMap.set(account.pubkey.toBase58(), {
        decimals: balance.uiTokenAmount.decimals,
        mint: balance.mint,
      })
    })
  }

  if (parsedTransaction.meta?.postTokenBalances) {
    parsedTransaction.meta.postTokenBalances.forEach((balance) => {
      const account =
        parsedTransaction.transaction.message.accountKeys[balance.accountIndex]
      mintMap.set(account.pubkey.toBase58(), {
        decimals: balance.uiTokenAmount.decimals,
        mint: balance.mint,
      })
    })
  }
}

function getInstructions(parsedTransaction: ParsedConfirmedTransaction) {
  const instructions = parsedTransaction.transaction.message.instructions.map(
    (
      instruction
    ): {
      instruction: ParsedInstruction | PartiallyDecodedInstruction
      inner: (ParsedInstruction | PartiallyDecodedInstruction)[]
    } => {
      if ('parsed' in instruction) {
        if (
          typeof instruction.parsed !== 'object' &&
          typeof instruction.parsed !== 'string'
        ) {
          throw new Error('Unexpected parsed response')
        }
      }

      return {
        instruction,
        inner: [],
      }
    }
  )

  if (parsedTransaction.meta?.innerInstructions) {
    for (let inner of parsedTransaction.meta.innerInstructions) {
      instructions[inner.index].inner.push(...inner.instructions)
    }
  }

  return instructions
}

function getTransfer(
  instruction: ParsedInstruction | PartiallyDecodedInstruction
): Transfer | TransferChecked | undefined {
  if ('parsed' in instruction && instruction.program === 'spl-token') {
    try {
      const { type: rawType } = instruction.parsed
      const type = rawType // create(rawType, TokenInstructionType);

      if (type === 'transferChecked') {
        return instruction.parsed.info // create(instruction.parsed.info, TransferChecked);
      } else if (type === 'transfer') {
        return instruction.parsed.info // create(instruction.parsed.info, Transfer);
      }
    } catch (error) {}
  }
  return undefined
}

type IndexedTransfer = {
  index: number
  childIndex?: number
  transfer: Transfer | TransferChecked
}

export function getTransfers(
  pubkey: PublicKey,
  parsed: ParsedConfirmedTransaction | null,
  mintMap: Map<string, MintDetails>
) {
  // Extract all transfers from transaction
  let transfers: IndexedTransfer[] = []

  if (!parsed) {
    return transfers
  }

  const address = pubkey.toBase58()

  // Extract mint information from token deltas
  // (used to filter out non-checked tokens transfers not belonging to this mint)
  extractMintDetails(parsed, mintMap)

  const instructions = getInstructions(parsed) // InstructionContainer.create(parsed)

  instructions.forEach(({ instruction, inner }, index: number) => {
    const transfer = getTransfer(instruction) // , cluster, signature);
    if (transfer) {
      transfers.push({
        transfer,
        index,
      })
    }
    inner.forEach((instruction, childIndex: number) => {
      const transfer = getTransfer(instruction) // , cluster, signature);
      if (transfer) {
        transfers.push({
          transfer,
          index,
          childIndex,
        })
      }
    })
  })

  // Filter out transfers not belonging to this mint
  transfers = transfers.filter(({ transfer }) => {
    const sourceKey = transfer.source
    const destinationKey = transfer.destination

    if ('tokenAmount' in transfer && transfer.mint === address) {
      return true
    } else if (
      mintMap.has(sourceKey) &&
      mintMap.get(sourceKey)?.mint === address
    ) {
      return true
    } else if (
      mintMap.has(destinationKey) &&
      mintMap.get(destinationKey)?.mint === address
    ) {
      return true
    }

    return false
  })

  return transfers
}
