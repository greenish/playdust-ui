type EpochExplorerType = {
  epoch: number;
  currentEpoch: number;
  firstSlot: number;
  lastSlot: number;
  firstBlock: number;
  firstTimestamp: number | null;
  lastBlock?: number;
  lastTimestamp: number | null;
};

export default EpochExplorerType;
