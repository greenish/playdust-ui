import styled from '@emotion/styled';

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
  background: ${({ position }) => (position === 'below' ? '#DCE8FD' : '#276EF1')};
`;

export default QueryPartDecorator;
