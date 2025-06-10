import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { TableRow } from '@material-ui/core';

export default withStyles((theme: Theme) =>
  createStyles({
    hover: {
      '&:hover': {
        backgroundColor: `${theme.palette.primary.light}!important`,
        opacity: '0.7',
      },
    },
  })
)(TableRow);
