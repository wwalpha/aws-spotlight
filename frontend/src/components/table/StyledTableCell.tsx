import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';

export default withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);
