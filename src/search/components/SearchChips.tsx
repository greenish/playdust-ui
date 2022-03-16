import styled from '@emotion/styled'
import { Chip, Typography } from '@mui/material'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import * as store from '../store'
import type { CollectionQuery, QueryType } from '../types/ComposedQueryType'

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const SpacedText = styled(Typography)`
  margin: 0 6px;
`

const SmallSpacedText = styled(Typography)`
  margin: 0 4px;
`

const ParenTypography = styled(Typography)`
  margin-top: -2px;
`

const CollectionChip = ({ value }: CollectionQuery) => {
  const { state, contents } = useRecoilValueLoadable(
    store.collectionById(value)
  )

  if (state === 'hasValue') {
    return <span>Collection: {contents.name || contents.symbol}</span>
  }

  return <span>Collection:</span>
}

const capitalize = (input: string) =>
  `${input[0].toUpperCase()}${input.slice(1)}`

const getChipLabel = (child: QueryType) => {
  switch (child.field) {
    case 'attribute':
      return `${child.trait}: ${child.value.join(', ')}`
    case 'collection':
      return <CollectionChip {...child} />
    case 'text':
      return child.value
    case 'range':
      return `${capitalize(child.value)}: ${child.min}-${child.max} SOL`
    default:
      const n: never = child

      return n
  }
}

const SearchChips = () => {
  const query = useRecoilValue(store.searchQueryValid)
  const removeChild = store.useRemoveChild()

  return (
    <ChipContainer>
      {query.flatMap((parent, idx) => {
        const moreThanOne = parent.length > 1
        const chips = parent.flatMap((child, ydx) => {
          const chip = (
            <Chip
              size="small"
              key={child.id}
              label={getChipLabel(child)}
              variant="outlined"
              onDelete={() => removeChild(child.id)}
            />
          )

          if (!moreThanOne) {
            return chip
          }

          if (ydx === 0) {
            return [
              <ParenTypography key={`open-paren-${idx}`}>(</ParenTypography>,
              chip,
            ]
          }

          const or = (
            <SmallSpacedText key={`or-${idx}-${ydx}`}>or</SmallSpacedText>
          )

          if (ydx === parent.length - 1) {
            return [
              or,
              chip,
              <ParenTypography key={`close-paren-${idx}`}>)</ParenTypography>,
            ]
          }

          return [or, chip]
        })

        const and = idx !== query.length - 1 && (
          <SpacedText key={`and-${idx}`}>&</SpacedText>
        )

        return [...chips, and]
      })}
    </ChipContainer>
  )
}

export default SearchChips
