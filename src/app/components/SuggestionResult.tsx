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
  highlight?: string
  showLoader: boolean
}

const SuggestionResult = ({
  label,
  highlight,
  parentProps,
  showLoader,
  term,
}: SuggestionResultProps) => {
  const content = useMemo(() => {
    if (!highlight) {
      return term
    }

    const parsed = parse(
      highlight.replaceAll('<em>', '<b>').replaceAll('</em>', '</b>')
    )

    return parsed
  }, [highlight, term])

  return (
    <>
      <li {...parentProps}>
        <Typography sx={{ fontSize: '80%' }}>
          {label}: {content}
        </Typography>
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
