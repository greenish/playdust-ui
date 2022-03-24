import { Box, Chip, Grid, Typography } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { ReactNode } from 'react'
import {
  abbreviatedNumber,
  normalizeTokenAmount,
} from '../../../../../helpers/utils'
import {
  useAccountDetails,
  useAccountInfo,
  useCoinGecko,
  useTokenRegistry,
} from '../../../store'
import { ExternalLink } from '../../ExternalLinks'
import { AccountLink } from '../../Links'

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

  const {
    extensions: { coingeckoId },
  } = tokenRegistry.get(pubkey.toBase58())

  const info = useCoinGecko(coingeckoId)

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
          footer={last_updated}
        />
      </Grid>
    </Grid>
  )
}

export const FungibleTokenMintAccountDetails = ({
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Current Supply
      </Grid>
      <Grid item xs={12} md={10}>
        {normalizeTokenAmount(supply, decimals)}
      </Grid>
      <Grid item xs={12} md={2}>
        Website
      </Grid>
      {!data?.parsed?.info?.isInitialized && (
        <>
          <Grid item xs={12} md={2}>
            Status
          </Grid>
          <Grid item xs={12} md={10}>
            Uninitialized
          </Grid>
        </>
      )}
      <Grid item xs={12} md={10}>
        <ExternalLink url={website} />
      </Grid>
      <Grid item xs={12} md={2}>
        Mint Authority
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={mintAuthority} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Freeze Authority
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={freezeAuthority} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Decimals
      </Grid>
      <Grid item xs={12} md={10}>
        {decimals}
      </Grid>
      <Grid item xs={12} md={2}>
        Tags
      </Grid>
      <Grid item xs={12} md={10}>
        {tagChips}
      </Grid>
    </Grid>
  )
}

export const FungibleTokenMintAccount = (props: TokenOverviewProps) => {
  return (
    <>
      <FungibleTokenMintAccountHeader {...props} />
      <FungibleTokenMintAccountStats {...props} />
      <FungibleTokenMintAccountDetails {...props} />
    </>
  )
}
