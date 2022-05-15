import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import TableSkeleton from '../_sharedComponents/TableSkeleton/TableSkeleton';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import Transactions from './Transactions/Transactions';

function AddressTransactions() {
  const [expanded, setExpanded] = useState(false);
  const [shouldRender, setShouldRender] = useState(expanded);
  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => {
        setExpanded(isExpanded);
        setShouldRender((current) => current || isExpanded);
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h5" component="h2" gutterBottom={false}>
          Transactions
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <SuspenseBoundary
          loading={<TableSkeleton />}
          error={null}
          shouldRender={shouldRender}
        >
          <Transactions />
        </SuspenseBoundary>
      </AccordionDetails>
    </Accordion>
  );
}

export default AddressTransactions;
