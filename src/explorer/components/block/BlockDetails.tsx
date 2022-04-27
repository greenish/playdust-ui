import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import { a11yProps, TabPanel } from '../common'
import { SlotAccounts, SlotPrograms, SlotRewards, SlotTransactions } from './'

interface BlockDetailsProps {
  slot: number
}

export const BlockDetails = ({ slot }: BlockDetailsProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue(parseInt(newValue))
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Transactions" {...a11yProps(0)} />
          <Tab label="Rewards" {...a11yProps(1)} />
          <Tab label="Programs" {...a11yProps(2)} />
          <Tab label="Accounts" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <SlotTransactions slot={slot} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SlotRewards slot={slot} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SlotPrograms slot={slot} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SlotAccounts slot={slot} />
      </TabPanel>
    </>
  )
}
