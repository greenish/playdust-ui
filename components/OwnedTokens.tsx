import { Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import TokenContainer from './TokenContainer'
import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import { fetchOwnedOnchain } from '../store'

const HelperMessageContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 8px;
  justify-content: center;
  font-style: italic;
`

interface OwnedTokensProp {
  publicKey: PublicKey
}

const OwnedTokens = ({ publicKey }: OwnedTokensProp) => {
  const ownedTokens = useRecoilValue(fetchOwnedOnchain(publicKey))

  return (
    <div>
      {
        ownedTokens.length ? (
          <TokenContainer tokens={ownedTokens} />
        ) : (
          <HelperMessageContainer>
            <Typography>No tokens found for address {publicKey?.toBase58()}</Typography>
          </HelperMessageContainer>
        )
      }
    </div>
  )
}

export default OwnedTokens