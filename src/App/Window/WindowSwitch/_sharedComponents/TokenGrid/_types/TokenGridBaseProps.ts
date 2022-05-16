interface TokenGridBaseProps {
  initialized: boolean;
  imageSize: number;
  cardGap: number;
  contentHeight: number;
  rowGap: number;
  next?: () => Promise<void>;
}

export default TokenGridBaseProps;
