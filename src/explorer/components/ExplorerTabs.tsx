import { Box, Tab, Tabs } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { FunctionComponent, useState } from 'react'
import { a11yProps, TabPanel } from './TabPanel'

export type ExplorerTab = [string, FunctionComponent<any>]

interface ExplorerTabsProps {
  pubkey: PublicKey
  tabs: ExplorerTab[]
}

export const ExplorerTabs = ({ pubkey, tabs }: ExplorerTabsProps) => {
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
          {tabs.map(([label]) => (
            <Tab key={label} label={label} {...a11yProps(0)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map(([, Component], idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          <Component pubkey={pubkey} />
        </TabPanel>
      ))}
    </>
  )
}
