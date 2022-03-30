import { Box, Chip, Grid, Stack, Typography } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { ReactNode } from 'react'
import { Instructions, Transfers } from '.'
import {
  abbreviatedNumber,
  compact,
  normalizeTokenAmount,
} from '../../../../../helpers/utils'
import {
  useAccountDetails,
  useAccountInfo,
  useCoinGecko,
  useTokenRegistry,
} from '../../../store'
import { ExplorerGrid } from '../../ExplorerGrid'
import { ExplorerTab, ExplorerTabs } from '../../ExplorerTabs'
import { ExternalLink } from '../../ExternalLinks'
import { AccountLink } from '../../Links'
import { Transactions } from '../../Transactions'
import { Distribution } from './Distribution'
import { Metadata } from './Metadata'

const IDENTICON_WIDTH = 64

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const FungibleTokenMintAccountHeader = ({
  pubkey,
}: TokenOverviewProps) => {
  const details = useAccountDetails(pubkey)

  const { tokenDetails } = details

  const icon = tokenDetails?.logoURI ? (
    <img
      src={tokenDetails.logoURI}
      alt="token logo"
      className="avatar-img rounded-circle border border-4 border-body"
      style={{ width: IDENTICON_WIDTH }}
    />
  ) : null

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs="auto">
          {icon}
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            {tokenDetails?.name || 'Unknown Token'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

interface TokenStatsProps {
  header: ReactNode
  details: ReactNode
  footer?: ReactNode
}

const TokenStats = ({ header, details, footer }: TokenStatsProps) => {
  const sx = {
    bgcolor: 'background.paper',
    border: '1px solid grey',
    borderRadius: '12px',
    padding: '12px',
  }

  return (
    <Box sx={sx}>
      <Typography variant="h6" component="h6" gutterBottom>
        {header}
      </Typography>
      <Typography variant="h5" component="h5" gutterBottom>
        {details}
      </Typography>
      {footer && (
        <Typography variant="h6" component="h6" gutterBottom>
          {footer}
        </Typography>
      )}
    </Box>
  )
}

export const FungibleTokenMintAccountStats = ({
  pubkey,
}: TokenOverviewProps) => {
  const tokenRegistry = useTokenRegistry()

  const tokenDetails = tokenRegistry.get(pubkey.toBase58())

  const info = useCoinGecko(tokenDetails?.extensions?.coingeckoId)

  let tokenPriceInfo
  let tokenPriceDecimals = 2

  const price = info.data.market_data.current_price.usd
  const volume_24 = info.data.market_data.total_volume.usd
  const market_cap = info.data.market_data.market_cap.usd
  const market_cap_rank = info.data.market_data.market_cap_rank
  const price_change_percentage_24h =
    info.data.market_data.price_change_percentage_24h
  const last_updated = new Date(info.data.last_updated)

  if (price < 1) {
    tokenPriceDecimals = 6
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TokenStats
          header={
            <>
              Price{' '}
              <Chip
                size="small"
                color="info"
                label={`Rank #${market_cap_rank}`}
              />
            </>
          }
          details={
            <>
              ${price.toFixed(tokenPriceDecimals)}{' '}
              {price_change_percentage_24h.toFixed(2)}%
            </>
          }
        />
      </Grid>
      <Grid item xs={4}>
        <TokenStats
          header="24 Hour Volume"
          details={abbreviatedNumber(volume_24)}
        />
      </Grid>
      <Grid item xs={4}>
        <TokenStats
          header="Market Cap"
          details={abbreviatedNumber(market_cap)}
          footer={<>{last_updated.toString()}</>}
        />
      </Grid>
    </Grid>
  )
}

export const FungibleTokenMintAccountOverview = ({
  pubkey,
}: TokenOverviewProps) => {
  const account = useAccountInfo(pubkey)

  const tokenRegistry = useTokenRegistry()

  const data = account?.data as ParsedAccountData

  const tokenDetails = tokenRegistry.get(pubkey.toBase58())

  const {
    parsed: {
      info: { supply, decimals, freezeAuthority, mintAuthority },
    },
  } = data

  const { extensions = {}, tags = [] } = tokenDetails

  const { website } = extensions

  const tagChips = tags.map((tag: string) => <Chip key={tag} label={tag} />)

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['Current Supply', normalizeTokenAmount(supply, decimals)],
    ['Website', <ExternalLink url={website} />],
    !data?.parsed?.info?.isInitialized && ['Status', 'Uninitialized'],
    ['Mint Authority', <AccountLink to={mintAuthority} allowCopy />],
    ['Freeze Authority', <AccountLink to={freezeAuthority} allowCopy />],
    ['Decimals', decimals],
    ['Tags', tagChips],
  ])

  return <ExplorerGrid rows={rows} />
}

export const FungibleTokenMintAccountDetails = ({
  pubkey,
}: TokenOverviewProps) => {
  const tabs: ExplorerTab[] = [
    ['History', Transactions],
    ['Transfers', Transfers],
    ['Instructions', Instructions],
    ['Distribution', Distribution],
    ['Metadata', Metadata],
  ]

  return <ExplorerTabs tabs={tabs} pubkey={pubkey} />
}

export const FungibleTokenMintAccount = (props: TokenOverviewProps) => {
  return (
    <Stack spacing={2}>
      <FungibleTokenMintAccountHeader {...props} />
      <FungibleTokenMintAccountStats {...props} />
      <FungibleTokenMintAccountOverview {...props} />
      <FungibleTokenMintAccountDetails {...props} />
    </Stack>
  )
}
