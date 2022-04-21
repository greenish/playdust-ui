import styled from '@emotion/styled'
import { CircularProgress, Typography } from '@mui/material'
import parse from 'html-react-parser'
import { HTMLAttributes, useMemo } from 'react'

const LoaderContainer = styled.div`
  display: flex;
  margin-top: 4px;
  margin-left: 36px;
`

interface SuggestionResultProps {
  label: string
  parentProps: HTMLAttributes<HTMLLIElement>
  term: string
  showLoader: boolean
}

const SuggestionResult = ({
  label,
  parentProps,
  showLoader,
  term,
}: SuggestionResultProps) => {
  const parsedLabel = useMemo(() => {
    const parsed = parse(
      label.replaceAll('<em>', '<b>').replaceAll('</em>', '</b>')
    )

    return parsed
  }, [label, term])

  return (
    <>
      <li {...parentProps}>
        <Typography sx={{ fontSize: '80%' }}>{parsedLabel}</Typography>
      </li>
      {showLoader && (
        <LoaderContainer>
          <CircularProgress size={25} />
        </LoaderContainer>
      )}
    </>
  )
}

export default SuggestionResult
