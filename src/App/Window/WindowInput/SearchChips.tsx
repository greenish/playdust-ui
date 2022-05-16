import styled from '@emotion/styled';
import { Chip, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import CollectionQueryNodeType from '../../../_types/CollectionQueryNodeType';
import type QueryNodeType from '../../../_types/QueryNodeType';
import useGoHome from '../../_hooks/useGoHome';
import searchStateAtom from '../_atoms/searchStateAtom';
import useRemoveQueryNode from '../_hooks/useRemoveQueryNode';
import collectionByIdAtom from './_atoms/collectionByIdAtom';

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const SpacedText = styled(Typography)`
  margin: 0 6px;
`;

const SmallSpacedText = styled(Typography)`
  margin: 0 4px;
`;

const ParenTypography = styled(Typography)`
  margin-top: -2px;
`;

function CollectionChip({ value }: CollectionQueryNodeType) {
  const collectionById = useRecoilValueLoadable(collectionByIdAtom(value));

  if (collectionById.state === 'hasValue') {
    return (
      <span>
        Collection:{' '}
        {collectionById.contents.name || collectionById.contents.symbol}
      </span>
    );
  }

  return <span>Collection:</span>;
}

const capitalize = (input: string) =>
  `${input[0].toUpperCase()}${input.slice(1)}`;

const getChipLabel = (child: QueryNodeType) => {
  switch (child.field) {
    case 'attribute': {
      if (child.value.length === 0) {
        return `Attribute Trait: ${child.trait}`;
      }

      const trait = child.trait === '' ? 'Attribute Value' : child.trait;

      return `${trait}: ${child.value.join(', ')}`;
    }
    case 'collection':
      return <CollectionChip {...child} />;
    case 'text':
      return `search: ${child.value}`;
    case 'range':
      return `${capitalize(child.value)}: ${child.min}-${child.max} ${
        child.value !== 'rarity-score' ? 'SOL' : ''
      }`;
    default: {
      const n: never = child;

      return n;
    }
  }
};

interface SearchChipsProps {
  disabled: boolean;
}

function SearchChips({ disabled }: SearchChipsProps) {
  const { query } = useRecoilValue(searchStateAtom);
  const removeQueryNode = useRemoveQueryNode();
  const goHome = useGoHome();

  return (
    <ChipContainer>
      {query.flatMap((parent, idx) => {
        const moreThanOne = parent.length > 1;
        const chips = parent.flatMap((child, ydx) => {
          const chip = (
            <Chip
              disabled={disabled}
              size="small"
              key={child.id}
              label={getChipLabel(child)}
              variant="outlined"
              onDelete={() =>
                query.flat().length === 1 ? goHome() : removeQueryNode(child.id)
              }
            />
          );

          if (!moreThanOne) {
            return chip;
          }

          if (ydx === 0) {
            return [
              <ParenTypography key={`open-paren-${idx}`}>(</ParenTypography>,
              chip,
            ];
          }

          const or = (
            <SmallSpacedText key={`or-${idx}-${ydx}`}>or</SmallSpacedText>
          );

          if (ydx === parent.length - 1) {
            return [
              or,
              chip,
              <ParenTypography key={`close-paren-${idx}`}>)</ParenTypography>,
            ];
          }

          return [or, chip];
        });

        const and = idx !== query.length - 1 && (
          <SpacedText key={`and-${idx}`}>&</SpacedText>
        );

        return [...chips, and];
      })}
    </ChipContainer>
  );
}

export default SearchChips;
