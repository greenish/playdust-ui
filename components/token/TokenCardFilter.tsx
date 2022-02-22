import { FilterAlt } from '@mui/icons-material'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
} from '@mui/material'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'
import SearchMetadata from '../../types/SearchMetadata'

interface TokenCardFilter {
  metadata: SearchMetadata
}

const TokenCardFilter = ({ metadata }: TokenCardFilter) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const addExactAttribute = store.useAddExactAttribute()
  const updateExactAtrribute = store.useUpdateExactAttribute()
  const exactAttributes = useRecoilValue(store.searchQueryExactAttributes)

  const attributes = metadata.offChainData.attributes!

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
            {attributes.map((attribute) => {
              const found = exactAttributes.find(
                (entry) =>
                  entry.trait === attribute.trait_type &&
                  entry.value?.includes(attribute.value)
              )

              return (
                <FormControlLabel
                  key={attribute.trait_type}
                  control={
                    <Checkbox
                      checked={!!found}
                      onChange={(_evt, nextValue) => {
                        if (!found) {
                          addExactAttribute(
                            [attribute.value],
                            attribute.trait_type,
                            'and'
                          )
                        } else {
                          updateExactAtrribute(
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
