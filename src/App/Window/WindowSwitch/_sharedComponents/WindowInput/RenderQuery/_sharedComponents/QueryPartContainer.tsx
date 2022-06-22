import styled from '@emotion/styled';
import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryRenderNodeMetaAtom from '../_atoms/searchQueryRenderNodeMetaAtom';
import RenderMapNodeType from '../_types/RenderMapNodeType';

type RootContainerProps = {
  highlightBackground: boolean;
  highlightColor: boolean;
};

interface QueryPartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  renderNode: RenderMapNodeType;
  highlightBackground?: boolean;
  highlightColor?: boolean;
  disableLineAbove?: boolean;
}

const RootContainer = styled.div<RootContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 4px;
  margin: 12px 0px;
  background: ${({ highlightBackground }) =>
    highlightBackground ? '#DCE8FD' : 'auto'};
  color: ${({ highlightColor }) => (highlightColor ? '#276EF1' : 'auto')};
  font-weight: ${({ highlightColor }) => (highlightColor ? 'bold' : 'auto')};
`;

type QueryPartDecoratorProps = {
  position: 'above' | 'below';
};

const QueryPartDecorator = styled.div<QueryPartDecoratorProps>`
  position: absolute;
  width: 100%;
  height: ${({ position }) => (position === 'above' ? '1px' : '2px')};
  top: ${({ position }) => (position === 'above' ? '-7px' : 'auto')};
  bottom: ${({ position }) => (position === 'below' ? '-7px' : 'auto')};
  left: 0px;
  background: ${({ position }) =>
    position === 'below' ? '#DCE8FD' : '#276EF1'};
`;

function QueryPartContainer({
  renderNode,
  highlightBackground,
  highlightColor,
  disableLineAbove,
  children,
  style,
  onClick,
}: QueryPartContainerProps) {
  const meta = useRecoilValue(searchQueryRenderNodeMetaAtom(renderNode));

  return (
    <RootContainer
      highlightBackground={highlightBackground || meta.highlightBackground}
      highlightColor={highlightColor || meta.isActive}
      style={style}
      onClick={onClick}
    >
      {children}
      {meta.renderLineBelow && <QueryPartDecorator position="below" />}
      {!disableLineAbove && meta.renderLineAbove && (
        <QueryPartDecorator position="above" />
      )}
    </RootContainer>
  );
}

export default QueryPartContainer;
