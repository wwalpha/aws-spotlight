import React, { FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

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
  })
);

export const ListItem: FunctionComponent<ListItemProps> = ({ children, text }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {};

  const open = Boolean(anchorEl);

  return (
    <React.Fragment>
      <MListItem
        button
        classes={{ button: classes.listItemButton }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={handleClick}>
        <ListItemIcon>{children}</ListItemIcon>
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
}
