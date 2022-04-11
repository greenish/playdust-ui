import { Chip } from '@mui/material'
import { TransactionInstruction } from '@solana/web3.js'
import { HexData } from '../common/HexData'
import { AccountLink } from '../Links'
import { DataCell, TableRow } from '../Table'

export function RawDetails({ ix }: { ix: TransactionInstruction }) {
  return (
    <>
      {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => {
        let _pubkey
        try {
          _pubkey = pubkey.toBase58()
        } catch (err) {
          _pubkey = ''
        }

        return (
          <TableRow key={keyIndex}>
            <DataCell>
              <span>Account #{keyIndex + 1} </span>
              {isWritable && <Chip label="Writable" size="small" />}
              {isSigner && <Chip label="Signer" size="small" />}
            </DataCell>
            <DataCell className="text-lg-end">
              <AccountLink to={_pubkey} allowCopy />
            </DataCell>
          </TableRow>
        )
      })}

      <TableRow>
        <DataCell>
          Instruction Data <span className="text-muted">(Hex)</span>
        </DataCell>
        <DataCell className="text-lg-end">
          <HexData raw={ix.data} />
        </DataCell>
      </TableRow>
    </>
  )
}
