import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js'
import {
  SignaturesAndTransactions,
  useAccountHistories,
  useParsedConfirmedTransaction,
  useParsedTokenAccountsByOwner,
  useTokenRegistry,
} from '../store'
import { ExplorerCard } from './ExplorerCard'
import { Identicon } from './Identicon'
import { AccountLink, SlotLink, TxLink } from './Links'

interface TokenHoldingsProps {
  pubkey: PublicKey
}

export const TokenHoldings = (props: TokenHistoryProps) => {
  return (
    <ExplorerCard skeleton="table">
      <TokenHoldingsContent {...props} />
    </ExplorerCard>
  )
}

export const TokenHoldingsContent = ({ pubkey }: TokenHoldingsProps) => {
  const tokens = useParsedTokenAccountsByOwner(pubkey)

  const tokenRegistry = useTokenRegistry()

  const rows = tokens.map((token) => {
    const pk = new PublicKey(token.account.owner).toString()

    const mintAddress = token.account.data.parsed.info.mint

    const tokenInfo = tokenRegistry.get(mintAddress)

    const tokenLogoURI = tokenInfo ? tokenInfo.logoURI : null
    const tokenSymbol = tokenInfo ? tokenInfo.symbol : ''
    const mintAddressLabel = tokenInfo
      ? `${tokenInfo.symbol} - ${tokenInfo.name}`
      : mintAddress

    const logo = (
      <>
        {tokenLogoURI ? (
          <img src={tokenLogoURI} width={16} alt="" />
        ) : (
          <Identicon address={mintAddress} />
        )}
      </>
    )

    const accountAddress = <span>{pk}</span>

    const mintAddressLink = (
      <AccountLink to={mintAddress} label={mintAddressLabel} />
    )

    const balance = (
      <>
        {token.account.data.parsed.info.tokenAmount.uiAmountString}{' '}
        {tokenSymbol}
      </>
    )

    return {
      logo,
      accountAddress,
      mintAddress: mintAddressLink,
      balance,
    }
  })

  const tableRows = rows.map((row, idx: number) => {
    return (
      <TableRow
        key={idx}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.logo}
        </TableCell>
        <TableCell>{row.accountAddress}</TableCell>
        <TableCell>{row.mintAddress}</TableCell>
        <TableCell>{row.balance}</TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Account Address</TableCell>
              <TableCell>Mint Address</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

interface TokenHistoryProps {
  pubkey: PublicKey
}

export const TokenHistory = (props: TokenHistoryProps) => {
  return (
    <ExplorerCard skeleton="table">
      <TokenHistoryContent {...props} />
    </ExplorerCard>
  )
}

interface TokenHistoryRow {
  slot: string
  result: string
  token: string
  instructionType: string
  transactionSignature: string
}

interface MintAndSignature {
  mint: string
  signature: ConfirmedSignatureInfo
}

interface TokenHistoryRowProps {
  mintAndSignature: MintAndSignature
}

export const TokenHistoryRow = ({ mintAndSignature }: TokenHistoryRowProps) => {
  const tokenRegistry = useTokenRegistry()
  const tx = useParsedConfirmedTransaction(mintAndSignature.signature.signature)

  if (!tx) {
    return null
  }

  const tokenInfo = tokenRegistry.get(mintAndSignature.mint)

  const tokenSymbol = tokenInfo ? tokenInfo.symbol : ''
  const mintAddressLabel = tokenInfo
    ? `${tokenInfo.symbol} - ${tokenInfo.name}`
    : mintAndSignature.mint

  const slot = <SlotLink to={tx.slot} allowCopy />

  const result = tx?.meta?.err ? (
    <Chip color="error" label="Error" />
  ) : (
    <Chip color="success" label="Sucess" />
  )

  const token = (
    <AccountLink to={mintAndSignature.mint} label={mintAddressLabel} />
  )

  const instructionType = '???' // TODO

  const transactionSignature = (
    <TxLink to={tx.transaction.signatures[0]} allowCopy />
  )

  const row = {
    slot,
    result,
    token,
    instructionType,
    transactionSignature,
  }

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {row.slot}
      </TableCell>
      <TableCell>{row.result}</TableCell>
      <TableCell>{row.token}</TableCell>
      <TableCell>{row.instructionType}</TableCell>
      <TableCell>{row.transactionSignature}</TableCell>
    </TableRow>
  )
}

export const TokenHistoryContent = ({ pubkey }: TokenHistoryProps) => {
  const tokens = useParsedTokenAccountsByOwner(pubkey)

  const tokenPubkeys = tokens.map((token) => token.pubkey)

  const histories = useAccountHistories(tokenPubkeys)

  const zipped = tokens.reduce(
    (accum: Record<string, SignaturesAndTransactions>, token, idx) => {
      accum[token.pubkey.toBase58()] = histories[idx]
      return accum
    },
    {}
  )

  const signatureMap: Record<string, number> = {}

  const mintAndSignatures = tokens
    .map((token) => {
      return {
        mint: token.account.data.parsed.info.mint,
        history: zipped[token.pubkey.toBase58()],
      }
    })
    .filter(({ history }) => {
      return history.signatures.length > 0
    })
    .flatMap(({ mint, history }) => {
      return history.signatures.map((signature) => {
        return {
          mint,
          signature,
        }
      })
    })
    .filter(({ signature }) => {
      if (signatureMap[signature.signature]) return false
      signatureMap[signature.signature]++
      return true
    })

  mintAndSignatures.sort((a, b) => {
    if (a.signature.slot > b.signature.slot) return -1
    if (a.signature.slot < b.signature.slot) return 1
    return 0
  })

  const tableRows = mintAndSignatures.map((mintAndSignature, idx: number) => {
    return <TokenHistoryRow key={idx} mintAndSignature={mintAndSignature} />
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Slot</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Instruction Type</TableCell>
            <TableCell>Transaction Signature</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

interface TokensProps {
  pubkey: PublicKey
}

export const Tokens = ({ pubkey }: TokensProps) => {
  return (
    <>
      <TokenHoldings pubkey={pubkey} />
      <TokenHistory pubkey={pubkey} />
    </>
  )
}
