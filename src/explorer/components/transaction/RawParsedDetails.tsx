import { ParsedInstruction } from '@solana/web3.js'
import { DataCell, TableRow } from '../common'

export function RawParsedDetails({
  ix,
  children,
}: {
  ix: ParsedInstruction
  children?: React.ReactNode
}) {
  return (
    <>
      {children}
      <TableRow>
        <DataCell>
          Instruction Data <span className="text-muted">(JSON)</span>
        </DataCell>
        <DataCell className="text-lg-end">
          <pre className="d-inline-block text-start json-wrap">
            {JSON.stringify(ix.parsed, null, 2)}
          </pre>
        </DataCell>
      </TableRow>
    </>
  )
}
