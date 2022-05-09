import { Skeleton } from '@mui/material';
import React from 'react';
import range from '../../_helpers/range';

interface TableSkeletonProps {
  rows?: number;
}

function TableSkeleton({ rows = 10 }: TableSkeletonProps) {
  const indexer = range(0, rows, 1);
  return (
    <>
      {indexer.map((i) => (
        <Skeleton key={i} animation="wave" />
      ))}
    </>
  );
}

export default TableSkeleton;
