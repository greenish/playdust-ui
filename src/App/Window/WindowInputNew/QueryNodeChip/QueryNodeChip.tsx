import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import QueryNodeType from '../../../../_types/QueryNodeType';
import collectionByIdAtom from '../../_atoms/collectionByIdAtom';
import attributeNodeUncommittedAtom from './_atoms/attributeNodeUncommittedAtom';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';

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

type ChipLabelProps = {
  node?: QueryNodeType;
  isActive: boolean;
};

function ChipLabel({ node, isActive }: ChipLabelProps) {
  const uncommitted = useRecoilValue(attributeNodeUncommittedAtom);

  if (isActive && uncommitted) {
    return (
      <>
        {uncommitted.key}: {uncommitted.values.join(', ')}
        {uncommitted.values.length > 0 && <>, &nbsp;</>}
      </>
    );
  }

  if (!node) {
    return null;
  }

  switch (node.field) {
    case 'attribute': {
      if (node.value.length === 0) {
        return <>Attribute Trait: {node.trait}</>;
      }

      const trait = node.trait === '' ? 'Attribute Value' : node.trait;

      return (
        <>
          {trait}: {node.value.join(', ')}
        </>
      );
    }
    case 'collection':
      return <CollectionChip {...node} />;
    case 'text':
      return <>search: {node.value}</>;
    case 'range':
      return (
        <>
          {capitalize(node.value)}: {node.min}-{node.max}{' '}
          {node.value !== 'rarity-score' ? 'SOL' : ''}
        </>
      );
    default: {
      const n: never = node;

      return n;
    }
  }
}

interface SearchChipsProps {
  disabled: boolean;
  isActive: boolean;
  node?: QueryNodeType;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  textInput: JSX.Element;
}

function RenderQueryNodeChip({
  className,
  disabled,
  isActive,
  node,
  onClick,
  textInput,
}: SearchChipsProps) {
  return (
    <Chip
      className={className}
      disabled={disabled}
      label={
        <>
          <ChipLabel node={node} isActive={isActive} />
          {isActive && textInput}
        </>
      }
      variant="outlined"
      color={isActive ? 'primary' : 'default'}
      onClick={onClick}
      sx={{
        border: isActive ? '2px solid red' : '',
      }}
    />
  );
}

type QueryNodeProps = {
  node?: QueryNodeType;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  textInput: JSX.Element;
};

function QueryNodeChip({ node, onClick, textInput }: QueryNodeProps) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);

  if (!node) {
    return (
      <QueryNodeChipContainer onClick={onClick}>
        <RenderQueryNodeChip
          isActive={true}
          disabled={false}
          onClick={onClick}
          textInput={textInput}
        />
      </QueryNodeChipContainer>
    );
  }

  return (
    <QueryNodeChipContainer onClick={onClick}>
      <RenderQueryNodeChip
        isActive={node.id === activeNode?.nodeId}
        node={node}
        disabled={false}
        textInput={textInput}
        onClick={(evt) => {
          setActiveNode({ nodeId: node.id, type: 'query' });
          evt.stopPropagation();
        }}
      />
    </QueryNodeChipContainer>
  );
}

export default QueryNodeChip;
