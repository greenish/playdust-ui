import { Box, Stack, Tab, Tabs, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import React, { FunctionComponent, useState } from 'react'
import { a11yProps, TabPanel } from './TabPanel'

export type ExplorerTab = [string, FunctionComponent<any>]

type ExplorerTabVariant = 'tabbed' | 'flat'

interface ExplorerTabsProps {
  pubkey: PublicKey
  tabs: ExplorerTab[]
  variant?: ExplorerTabVariant
}

export const TabbedExplorerTabs = ({ pubkey, tabs }: ExplorerTabsProps) => {
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

export const FlatExplorerTabs = ({ pubkey, tabs }: ExplorerTabsProps) => {
  return (
    <>
      {tabs.map(([label, Component], idx) => (
        <Stack spacing={2}>
          <Typography variant="h2">{label}</Typography>
          <Component pubkey={pubkey} />
        </Stack>
      ))}
    </>
  )
}

export const ExplorerTabs = (props: ExplorerTabsProps) => {
  const Component =
    props.variant === 'flat' ? FlatExplorerTabs : TabbedExplorerTabs
  return <Component {...props} />
}
