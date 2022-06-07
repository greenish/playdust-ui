import styled from '@emotion/styled';
import { Check } from '@mui/icons-material';
import { IconButton, TextField, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import RangeQueryNodeType from '../../../../_types/RangeQueryNodeType';
import SearchFilterUnionType from '../../../../_types/SearchFilterUnionType';

interface RangeInputProps {
  value: SearchFilterUnionType;
  min: number | undefined;
  max: number | undefined;
  onApply: (newValue: Omit<RangeQueryNodeType, 'field'>) => void;
  sol?: boolean;
}

interface RangeTextFieldProps {
  value: number | undefined;
  label: string;
  setter: Dispatch<SetStateAction<number | undefined>>;
  sol?: boolean;
}

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function RangeTextField({ value, label, setter, sol }: RangeTextFieldProps) {
  return (
    <TextField
      label={label}
      placeholder={sol ? 'SOL' : ''}
      size="small"
      type="number"
      value={value === undefined ? '' : value}
      onChange={(evt) => {
        const parsed = parseFloat(evt.target.value);

        if (Number.isNaN(parsed)) {
          return setter(undefined);
        }

        return setter(parseFloat(evt.target.value));
      }}
    />
  );
}

function RangeInput(props: RangeInputProps) {
  const { value, onApply } = props;
  const [min, setMin] = useState(props.min);
  const [max, setMax] = useState(props.max);

  const disabled = useMemo(() => {
    if (min === undefined || max === undefined) {
      return true;
    }

    return !(min >= 0 && max > 0 && min < max);
  }, [min, max]);

  return (
    <RootContainer>
      <RangeTextField label="min" value={min} setter={setMin} sol={props.sol} />
      <Typography sx={{ mx: 1 }}>to</Typography>
      <RangeTextField label="max" value={max} setter={setMax} sol={props.sol} />
      <IconButton
        sx={{ ml: 1 }}
        disabled={disabled}
        onClick={() => {
          // if (min && max) {
          //   onApply({ min, max, value });
          // }
        }}
      >
        <Check />
      </IconButton>
    </RootContainer>
  );
}

export default RangeInput;
