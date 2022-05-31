import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import SuspenseBoundary from '../../../../_sharedComponents/SuspenseBoundary/SuspenseBoundary';
import SkeletonRows from '../../_sharedComponents/SkeletonRows';

type ExplorerAccordionPropTypes = {
  id: string;
  title: JSX.Element | string;
  content: JSX.Element;
  expanded?: boolean;
  onChange?: AccordionProps['onChange'];
};

function ExplorerAccordion({
  id,
  title,
  content,
  expanded = false,
  onChange,
}: ExplorerAccordionPropTypes) {
  const [accordionState, setAccordionState] = useState({
    expanded,
    wasExpanded: expanded,
  });

  const currentlyExpanded = onChange ? expanded : accordionState.expanded;

  return (
    <Accordion
      expanded={currentlyExpanded}
      onChange={(e, isExpanded) => {
        setAccordionState({
          expanded: isExpanded,
          wasExpanded: accordionState.wasExpanded || isExpanded,
        });
        if (onChange) {
          onChange(e, isExpanded);
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        aria-label={typeof title === 'string' ? title : 'Accordion Title'}
        id={`${id}-header`}
      >
        <Typography variant="h5" component="h2" gutterBottom={false}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails aria-labelledby={`${id}-header`} id={`${id}-content`}>
        <SuspenseBoundary
          content={content}
          loading={<SkeletonRows />}
          error={null}
          shouldRender={accordionState.wasExpanded}
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default ExplorerAccordion;
