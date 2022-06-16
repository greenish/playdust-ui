import styled from '@emotion/styled';

type QueryPartContainerProps = {
  highlightBackground?: boolean
  highlightColor?: boolean
};

const QueryPartContainer = styled.div<QueryPartContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 4px;
  margin: 12px 0px;
  background: ${({ highlightBackground }) => (highlightBackground ? '#DCE8FD' : 'auto')};
  color: ${({ highlightColor }) => (highlightColor ? '#276EF1' : 'auto')};
  font-weight: ${({ highlightColor }) => (highlightColor ? 'bold' : 'auto')};
`;

export default QueryPartContainer;
