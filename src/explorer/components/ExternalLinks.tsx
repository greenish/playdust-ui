import { Box, Divider, Link } from '@mui/material'
import React from 'react'

interface ExternalLinkProps {
  label?: string
  url: string
}

export function ExternalLink({ label, url }: ExternalLinkProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      {label || url}
    </Link>
  )
}

const defaultMappingFn = (baseUrl: string, filter: string, value: string) =>
  `${baseUrl}/${filter}/${value}`

const solanaBeachMappingFn = (
  baseUrl: string,
  filter: string,
  value: string
) => {
  const map: { [index: string]: string } = {
    account: 'address',
  }
  const mappedFilter = map[filter] || filter
  return defaultMappingFn(baseUrl, mappedFilter, value)
}

interface ExternalLinksProps {
  filter: string
  value: string
}

export function ExternalLinks({ filter, value }: ExternalLinksProps) {
  const pairs: [string, string, (a: string, b: string, c: string) => string][] =
    [
      ['Solana Explorer', 'http://explorer.solana.com', defaultMappingFn],
      ['Solscan', 'https://solscan.io', defaultMappingFn],
      ['Solana Beach', 'https://solanabeach.io', solanaBeachMappingFn],
    ]

  const links = pairs.map(([label, baseUrl, mappingFn], idx) => {
    const url = mappingFn(baseUrl, filter, value)

    return (
      <React.Fragment key={idx}>
        <ExternalLink label={label} url={url} />
        <Divider orientation="vertical" flexItem />
      </React.Fragment>
    )
  })

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {links}
    </Box>
  )
}
