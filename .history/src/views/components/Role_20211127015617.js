import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const JobCard = () => {
  return (
    <Accordion expanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>test</AccordionSummary>
      <AccordionDetails>test</AccordionDetails>
    </Accordion>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function Role() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <JobCard />
    </div>
  );
}
