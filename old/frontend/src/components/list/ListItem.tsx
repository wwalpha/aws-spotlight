import React, { FunctionComponent, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  ListItem as MListItem,
  ListItemIcon,
  Popover,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    listItemButton: {
      '&:hover': { backgroundColor: 'rgba(111, 44, 145, 0.8)' },
    },
    popover: { pointerEvents: 'none' },
    paper: {
      padding: spacing(1),
      backgroundColor: 'rgba(111, 44, 145, 0.8)',
      color: 'white',
      boxShadow: 'none',
      borderRadius: '0px',
      minWidth: spacing(20),
      minHeight: spacing(4),
      display: 'flex',
      alignItems: 'center',
    },
    icon: { minWidth: 'auto' },
  })
);

export const ListItem: FunctionComponent<ListItemProps> = ({ children, text, path, onClick }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <MListItem
        button
        //@ts-ignore
        component={Link}
        to={path}
        classes={{ button: classes.listItemButton }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={onClick}>
        <ListItemIcon className={classes.icon}>{children}</ListItemIcon>
      </MListItem>
      <Popover
        className={classes.popover}
        classes={{ paper: classes.paper }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClick={handlePopoverClose}
        onClose={handlePopoverClose}
        onMouseLeave={handlePopoverClose}
        disableRestoreFocus>
        <Typography variant="button">{text}</Typography>
      </Popover>
    </React.Fragment>
  );
};

export interface ListItemProps {
  text?: string;
  path?: string;
  onClick?: MouseEventHandler;
}
