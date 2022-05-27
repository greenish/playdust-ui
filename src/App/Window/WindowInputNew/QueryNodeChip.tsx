import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import QueryNodeType from '../../../_types/QueryNodeType';
import collectionByIdAtom from '../_atoms/collectionByIdAtom';
import searchQueryActiveNodeAtom from './_atoms/searchQueryActiveNodeAtom';

const QueryNodeChipContainer = styled.div`
  display: flex;
  align-items: start;
`;

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

function RenderQueryNodeChip({
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

type QueryNodeProps = {
  node: QueryNodeType;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

function QueryNodeChip({ node, onClick }: QueryNodeProps) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);

  return (
    <QueryNodeChipContainer onClick={onClick}>
      <RenderQueryNodeChip
        isActive={node.id === activeNode?.nodeId}
        node={node}
        disabled={false}
        onClick={(evt) => {
          setActiveNode({ nodeId: node.id, type: 'query' });
          evt.stopPropagation();
        }}
      />
    </QueryNodeChipContainer>
  );
}

export default QueryNodeChip;
