import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Chip, Typography } from '@material-ui/core';
import { Domains } from 'typings';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(({ spacing }: Theme) =>
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
    version: { fontFamily: 'fantasy' },
    date: { fontFamily: 'fantasy', paddingLeft: spacing(2) },
  })
);

const appState = (state: Domains.State) => state.app;

export const ReleaseNotes = () => {
  const classes = useStyles();
  const { releaseNotes } = useSelector(appState);

  return (
    <Box display="flex" flexDirection="column" margin="16px">
      {releaseNotes?.map((item) => (
        <Box key={item.version}>
          <Box display="flex" alignItems="baseline">
            <Typography variant="h4" className={classes.version}>
              {item.version}
            </Typography>
            <Typography variant="h5" className={classes.date}>
              {item.date}
            </Typography>
          </Box>
          {item.texts.map((text, idx) => {
            return (
              <Box key={`${text.type}.${idx}`} display="flex" alignItems="center" margin="8px 16px">
                <Chip label="FEATURE" color="primary" className={clsx(classes.feature, classes.chip)} />
                <Typography variant="subtitle1" className={classes.announce}>
                  {text.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ))}
      {/* <Box className={classes.row}>
        <Chip label="FEATURE" color="primary" className={clsx(classes.feature, classes.chip)} />
        <span className={classes.announce}>xxxxxxxxxxxxxxxxxxx</span>
      </Box>
      <Box className={classes.row}>
        <Chip label="ISSUE" className={clsx(classes.issue, classes.chip)} />
        <span className={classes.announce}>xxxxxxxxxxxxxxxxxxx</span>
      </Box> */}
    </Box>
  );
};
