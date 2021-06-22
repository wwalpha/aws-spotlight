import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import { AppActions } from '@actions';
import { Domains } from 'typings';

// const drawerWidth = 240;

const useStyles = makeStyles(({ transitions, spacing, palette, shape }: Theme) =>
  createStyles({
    appBar: {
      transition: transitions.create(['margin', 'width'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    // appBarShift: {
    //   width: `calc(100% - ${drawerWidth}px)`,
    //   marginLeft: drawerWidth,
    //   transition: transitions.create(['margin', 'width'], {
    //     easing: transitions.easing.easeOut,
    //     duration: transitions.duration.enteringScreen,
    //   }),
    // },
    menuButton: { marginRight: spacing(2) },
    hide: { display: 'none' },
    title: {
      flexGrow: 1,
      fontSize: '1.5rem',
      fontWeight: 600,
      wordSpacing: spacing(1),
    },
    search: {
      position: 'relative',
      borderRadius: shape.borderRadius,
      // backgroundColor: fade(palette.common.white, 0.15),
      // '&:hover': { backgroundColor: fade(palette.common.white, 0.25) },
      marginLeft: 0,
      width: 'auto',
    },
    searchIcon: {
      padding: spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: { color: 'inherit' },
    inputInput: {
      padding: spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${spacing(4)}px)`,
      transition: transitions.create('width'),
      width: '100%',
    },
  })
);

const appState = (state: Domains.State) => state.app;

export const Header = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { title, version } = useSelector(appState);
  const actions = bindActionCreators(AppActions, dispatch);

  const handleExit = async () => {
    window.sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <AppBar
      position="static"
      className={clsx(classes.appBar, {
        // [classes.appBarShift]: open,
      })}>
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          {title}
        </Typography>
        <div className={classes.search}>
          {/* <div className={classes.searchIcon}>
            <SearchIcon />
          </div> */}
          {/* <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          /> */}
          {version}
        </div>
        <IconButton color="inherit" onClick={handleExit}>
          <ExitToAppIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
