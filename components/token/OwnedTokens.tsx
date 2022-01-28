import { Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import TokenContainer from './TokenContainer'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import { fetchOwnedOnchain } from '../../store'
import { Container } from '@mui/material'

const HelperMessageContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 8px;
  justify-content: center;
  font-style: italic;
`

const ContentContainer = styled(Container)`
  height: 100%;
`

interface OwnedTokensProp {
  publicKey: PublicKey
}

const OwnedTokens = ({ publicKey }: OwnedTokensProp) => {
  const ownedTokens = useRecoilValue(fetchOwnedOnchain(publicKey))

  return (
    <ContentContainer>
      {ownedTokens.length ? (
        <TokenContainer initialized tokens={ownedTokens} hasMore={false} />
      ) : (
        <HelperMessageContainer>
          <Typography>
            No tokens found for address {publicKey?.toBase58()}
          </Typography>
        </HelperMessageContainer>
      )}
    </ContentContainer>
  )
}

export default OwnedTokens
