import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Loading } from '@comp';

const useStyles = makeStyles(({}: Theme) =>
  createStyles({
    root: {
      width: 'calc(100vw - 400px)',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px 200px',
    },
  })
);

export const Initialize = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Loading height="32px" />
    </Box>
  );
};
