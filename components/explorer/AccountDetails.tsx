import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { Domains } from './Domains'
import { a11yProps, TabPanel } from './TabPanel'
import { Tokens } from './Tokens'
import { Transactions } from './Transactions'

interface AccountDetailsProps {
  pubkey: string
}

export const AccountDetails = ({ pubkey }: AccountDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
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
