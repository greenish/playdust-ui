import styled from '@emotion/styled'
import { ChevronRight, ExpandMore } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import type { AttributeQuery } from '../types/ComposedQueryType'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: scroll;
`

const normalizeOptions = (
  options: string[],
  found: AttributeQuery | undefined,
  isExpanded: boolean
) => {
  const normalized = options
    .map((option) => ({
      option,
      checked: !!(found && found.value.includes(option)),
    }))
    .sort((a, b) => {
      if (a.checked === b.checked) {
        return 0
      }

      return a.checked ? -1 : 1
    })

  if (isExpanded) {
    return normalized
  }

  const numChecked = normalized.filter((option) => option.checked).length
  const sliceAmount = Math.max(numChecked, 5)

  return normalized.slice(0, sliceAmount)
}

const AttributeFilters = () => {
  const { attributes } = useRecoilValue(store.searchResults)
  const queries = useRecoilValue(store.searchQueryAttributes)
  const addAttribute = store.useAddAttribute()
  const updateAttribute = store.useUpdateAttribute()
  const [showAll, setShowAll] = useState<{ [key: string]: boolean }>({})

  return (
    <RootContainer>
      {attributes.map((attribute) => {
        const isExpanded = showAll[attribute.trait] || false
        const found = queries.find((entry) => entry.trait === attribute.trait)
        const options = normalizeOptions(attribute.options, found, isExpanded)

        return (
          <FormControl
            sx={{ m: 1, mb: 2 }}
            component="fieldset"
            variant="standard"
            key={attribute.trait}
          >
            <Button
              size="small"
              endIcon={isExpanded ? <ExpandMore /> : <ChevronRight />}
              onClick={() =>
                setShowAll({ ...showAll, [attribute.trait]: !isExpanded })
              }
            >
              {attribute.trait}
            </Button>
            <FormGroup>
              {options.map(({ option, checked }) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={checked}
                      onChange={() => {
                        if (!found) {
                          return addAttribute([option], attribute.trait, 'and')
                        }

                        if (!checked) {
                          return updateAttribute(found.id, {
                            value: [...found.value, option],
                          })
                        }

                        const nextValue = found.value.filter(
                          (entry) => entry !== option
                        )

                        return updateAttribute(
                          found.id,
                          {
                            value: nextValue,
                          },
                          true
                        )
                      }}
                      name={option.toString()}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        )
      })}
    </RootContainer>
  )
}

export default AttributeFilters
