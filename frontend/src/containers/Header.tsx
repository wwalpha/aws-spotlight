import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { Domains } from 'typings';
import { AppActions } from '@actions';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const useStyles = makeStyles(({ transitions, spacing }: Theme) =>
  createStyles({
    appBar: {
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
      zIndex: 1300,
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.easeOut,
        duration: transitions.duration.enteringScreen,
      }),
      zIndex: 1300,
    },
    menuButton: { marginRight: spacing(2) },
    hide: { display: 'none' },
    title: { flexGrow: 1, textAlign: 'center' },
  })
);

const appState = (state: Domains.State) => state.app;

export const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open } = useSelector(appState);
  const actions = bindActionCreators(AppActions, dispatch);

  const handleDrawerOpen = () => {
    actions.sidemenu(true);
  };

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
          AWS RESOURCE MANAGEMENT SYSTEM
        </Typography>
        <Button color="inherit" size="large">
          LOGOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
};
