import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { Domains, Tokens, Transactions } from '../../components/explorer'
import { useAccountDetails } from '../../store'
import { a11yProps, TabPanel } from './TabPanel'

type TokenDetailsProps = {
  pubkey: any
}

const TokenFungibleMintDetails = ({ pubkey }: TokenDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="History" {...a11yProps(0)} />
          <Tab label="Transfers" {...a11yProps(1)} />
          <Tab label="Instructions" {...a11yProps(2)} />
          <Tab label="Distributions" {...a11yProps(3)} />
          <Tab label="Metadata" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={3}></TabPanel>
      <TabPanel value={value} index={4}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
    </>
  )
}

const TokenNonFungibleMintDetails = ({ pubkey }: TokenDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="History" {...a11yProps(0)} />
          <Tab label="Tokens" {...a11yProps(1)} />
          <Tab label="Domains" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Transactions pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tokens pubkey={pubkey} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Domains pubkey={pubkey} />
      </TabPanel>
    </>
  )
}

export const TokenDetails = ({ pubkey }: TokenDetailsProps) => {
  let details = useAccountDetails(pubkey)

  const { nftData, isMetaplexNFT } = details
  return (
    <>
      {isMetaplexNFT && nftData ? (
        <TokenNonFungibleMintDetails pubkey={pubkey} />
      ) : (
        <TokenFungibleMintDetails pubkey={pubkey} />
      )}
    </>
  )
}
