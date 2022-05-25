import { Chip } from '@mui/material';
import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import type QueryNodeType from '../../../_types/QueryNodeType';
import collectionByIdAtom from '../_atoms/collectionByIdAtom';

function CollectionChip({ value }: QueryNodeType) {
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
  isActive: boolean;
  node: QueryNodeType;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function QueryNodeChip({
  className,
  disabled,
  isActive,
  node,
  onClick,
}: SearchChipsProps) {
  return (
    <Chip
      className={className}
      disabled={disabled}
      label={getChipLabel(node)}
      variant="outlined"
      color={isActive ? 'primary' : 'default'}
      onClick={onClick}
      sx={{
        border: isActive ? '2px solid red' : '',
        margin: '-1px',
      }}
    />
  );
}

export default QueryNodeChip;
