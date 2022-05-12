interface TokenGridBaseProps {
  initialized: boolean;
  imageSize: number;
  cardGap: number;
  contentHeight: number;
  rowGap: number;
  next?: () => void;
}

export default TokenGridBaseProps;
