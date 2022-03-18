import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import React from 'react'
import { pubkeyToString } from '../../../helpers/utils'
import { DomainInfo, useUserDomains } from '../store'
import { ExplorerCard } from './ExplorerCard'
import { AccountLink } from './Links'

interface DomainRow {
  key: string
  name: string
  address: string
  classAddress: string
}

interface DomainsProps {
  pubkey: PublicKey
}

export const Domains = (props: DomainsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <DomainsContent {...props} />
    </ExplorerCard>
  )
}

export const DomainsContent = ({ pubkey }: DomainsProps) => {
  const domains = useUserDomains(pubkey)

  if (!domains || domains.length === 0) {
    return <div>No domain name found</div>
  }

  const rows = domains.map((domain: DomainInfo) => {
    const row: any = {}

    row.key = domain.address?.toBase58()
    row.name = domain.name
    row.address = pubkeyToString(domain.address)
    row.classAddress = pubkeyToString(domain.class)

    return row
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Domain name</TableCell>
            <TableCell>Domain Address</TableCell>
            <TableCell>Domain Class Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: DomainRow) => {
            return (
              <TableRow
                key={row.key}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>
                  <AccountLink to={row.address} allowCopy />
                </TableCell>
                <TableCell>
                  <AccountLink to={row.classAddress} allowCopy />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
