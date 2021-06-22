import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: spacing(2),
      },
    },
    progress: {
      height: spacing(2),
    },
  })
);

const LinearIndeterminate: FunctionComponent<LinearIndeterminateProps> = ({ height }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress classes={{ root: classes.progress }} style={{ height }} />
    </div>
  );
};

export interface LinearIndeterminateProps {
  height?: string;
}

export default LinearIndeterminate;
