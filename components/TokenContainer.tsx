import {
  useMemo,
  useState,
} from 'react'
import {
  CircularProgress,
  Container,
} from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'
import TokenCard from '../components/TokenCard'
import { ParsedMetadata } from '../solana/types'
import styled from '@emotion/styled'

const InfiniteScrollContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: scroll;
  width: 100%;
  justify-content: center;
`

const TokensContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-around;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;
`

const Loader = () => (
  <LoaderContainer>
    <CircularProgress />
  </LoaderContainer>
)

const initialMax = 10
const incrementBy = 10

const scrollId = "token-container-scrollable-box"

interface TokenContainerProps {
  tokens: ParsedMetadata[]
}

const TokenContainer = ({
  tokens,
}: TokenContainerProps) => {
  const [numTokens, setNumTokens] = useState(initialMax)

  const enhancedTokens = useMemo(() => {
    return tokens.slice(0, numTokens)
  }, [tokens, numTokens])

  return (
    <InfiniteScrollContainer id={scrollId}>
      <InfiniteScroll
        scrollableTarget={scrollId}
        scrollThreshold={.9}
        dataLength={enhancedTokens.length}
        next={() => {
          setNumTokens(numTokens + incrementBy)
        }}
        hasMore={enhancedTokens.length < tokens.length}
        loader={<Loader />}
      >
        <Container>
          <TokensContainer>
            {
              enhancedTokens.map(token => (
                <TokenCard
                  key={token.mint}
                  metadata={token}
                />
              ))
            }
          </TokensContainer>
        </Container>
      </InfiniteScroll>
    </InfiniteScrollContainer>
  )
}

export default TokenContainer
