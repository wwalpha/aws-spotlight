import React from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import { Domains } from 'typings';
import { AppActions, ResActions } from '@actions';
import { ListItem } from '@comp';
import { Paths, SVG } from '@constants';

const useStyles = makeStyles(({ spacing, transitions, mixins, palette }: Theme) =>
  createStyles({
    root: {
      width: spacing(8),
      backgroundColor: palette.secondary.main,
      borderRadius: 0,
      height: '100%',
    },
    listItemButton: {
      '&:hover': { backgroundColor: 'rgba(111, 44, 145, 0.8)' },
    },
    menuIcon: { color: 'white' },
    list: {},
    // drawer: {
    //   width: drawerWidth,
    //   flexShrink: 0,
    //   whiteSpace: 'nowrap',
    // },
    // drawerOpen: {
    //   width: drawerWidth,
    //   transition: transitions.create('width', {
    //     easing: transitions.easing.sharp,
    //     duration: transitions.duration.enteringScreen,
    //   }),
    // },
    // drawerClose: {
    //   transition: transitions.create('width', {
    //     easing: transitions.easing.sharp,
    //     duration: transitions.duration.leavingScreen,
    //   }),
    //   overflowX: 'hidden',
    //   width: spacing(0),
    // },
  })
);

const appState = (state: Domains.State) => state.app;

export const Sidemenu = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { open } = useSelector(appState);
  const actions = bindActionCreators(AppActions, dispatch);

  const handlerOpen = () => {
    actions.sidemenu(true);
  };

  const handleClose = () => {
    actions.sidemenu(false);
  };

  return (
    <Paper elevation={2} classes={{ root: classes.root }}>
      <Box display="flex" alignItems="center" justifyContent="center" height="64px">
        <IconButton color="inherit" aria-label="open drawer" onClick={handlerOpen}>
          <MenuIcon className={classes.menuIcon} fontSize="large" />
        </IconButton>
      </Box>
      <List>
        <ListItem
          text="Amazon EC2"
          path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.EC2]}
          onClick={() => {
            actions.title('Amazon EC2');
          }}>
          <SVG.EC2Icon />
        </ListItem>
        <ListItem
          text="Amazon RDS"
          path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.RDS]}
          onClick={() => {
            actions.title('Amazon RDS');
          }}>
          <SVG.RDSIcon />
        </ListItem>
        <ListItem
          text="Amazon DynamoDB"
          path={Paths.ROUTE_PATHS[Paths.ROUTE_PATH_INDEX.DYNAMODB]}
          onClick={() => {
            actions.title('Amazon DynamoDB');
          }}>
          <SVG.DynamoDBIcon />
        </ListItem>
      </List>
    </Paper>
    // <Drawer
    //   variant="permanent"
    //   className={clsx(classes.drawer, {
    //     [classes.drawerOpen]: open,
    //     [classes.drawerClose]: !open,
    //   })}
    //   classes={{
    //     paper: clsx({
    //       [classes.drawerOpen]: open,
    //       [classes.drawerClose]: !open,
    //     }),
    //   }}>

    // </Drawer>
  );
};
