import { FilterAlt } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import { NFTSource } from '../types/OpenSearchIndex'

interface TokenCardFilter {
  metadata: NFTSource
}

const TokenCardFilter = ({ metadata }: TokenCardFilter) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const addAttribute = store.useAddAttribute()
  const updateAtrribute = store.useUpdateAttribute()
  const exactAttributes = useRecoilValue(store.searchQueryAttributes)
  const isCollectionQuery = useRecoilValue(store.isCollectionQuery)
  const attributes = metadata.offChainData.attributes!
  const prependCollectionQuery = store.usePrependCollectionQuery()
  const { heuristicCollectionId } = metadata

  return (
    <>
      <IconButton onClick={(evt) => setAnchorEl(evt.currentTarget)}>
        <FilterAlt />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormGroup>
            {!isCollectionQuery && heuristicCollectionId && (
              <Button
                onClick={() => prependCollectionQuery(heuristicCollectionId)}
              >
                Search in Collection
              </Button>
            )}
            {attributes.map((attribute) => {
              const found = exactAttributes.find(
                (entry) =>
                  entry.trait === attribute.trait_type &&
                  entry.value?.includes(attribute.value)
              )

              return (
                <FormControlLabel
                  key={`${attribute.trait_type}:${attribute.value}`}
                  control={
                    <Checkbox
                      checked={!!found}
                      onChange={(_evt) => {
                        if (!found) {
                          addAttribute(
                            [attribute.value],
                            attribute.trait_type,
                            'and'
                          )
                        } else {
                          updateAtrribute(
                            found.id,
                            {
                              value: found.value.filter(
                                (entry) => entry !== attribute.value
                              ),
                            },
                            true
                          )
                        }

                        setAnchorEl(null)
                      }}
                    />
                  }
                  label={`${attribute.trait_type}: ${attribute.value}`}
                />
              )
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  )
}

export default TokenCardFilter
