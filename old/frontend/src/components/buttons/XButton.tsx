import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, CircularProgress, Button, ButtonProps, colors } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      color: colors.green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const XButton: FunctionComponent<Props> = ({ isLoading, containerClassName, children, ...props }) => {
  const classes = useStyles();

  return (
    <Box margin={1} position="relative" className={containerClassName}>
      <Button disableFocusRipple disableTouchRipple fullWidth {...props} disabled={isLoading}>
        {children}
      </Button>
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </Box>
  );
};

interface Props extends ButtonProps {
  isLoading?: boolean;
  containerClassName?: string;
}

export default XButton;
