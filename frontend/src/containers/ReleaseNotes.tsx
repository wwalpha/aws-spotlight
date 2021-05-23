import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles(({}: Theme) =>
  createStyles({
    row: { margin: '8px 16px' },
    chip: {
      color: 'white',
      fontWeight: 600,
      width: '100px',
    },
    issue: { backgroundColor: '#db4437' },
    feature: { backgroundColor: '#0f9d58' },
    announce: {
      margin: '0px 16px',
    },
  })
);

const ReleaseNotes = () => {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" margin="8px">
      <Box className={classes.row}>
        <Chip label="FEATURE" color="primary" className={clsx(classes.feature, classes.chip)} />
        <span className={classes.announce}>xxxxxxxxxxxxxxxxxxx</span>
      </Box>
      <Box className={classes.row}>
        <Chip label="ISSUE" className={clsx(classes.issue, classes.chip)} />
        <span className={classes.announce}>xxxxxxxxxxxxxxxxxxx</span>
      </Box>
    </Box>
  );
};

export default ReleaseNotes;
