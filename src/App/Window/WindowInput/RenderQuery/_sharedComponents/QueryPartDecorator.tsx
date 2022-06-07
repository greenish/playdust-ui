import styled from '@emotion/styled';

type QueryPartDecoratorProps = {
  position: 'above' | 'below';
};

const QueryPartDecorator = styled.div<QueryPartDecoratorProps>`
  position: absolute;
  width: 100%;
  height: 7px;
  top: ${({ position }) => (position === 'above' ? '-7px' : 'auto')};
  bottom: ${({ position }) => (position === 'below' ? '-7px' : 'auto')};
  left: 0px;
  background: rgb(220, 220, 220);
`;

export default QueryPartDecorator;
