import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { StyledTableCell } from '@comp';
import { ResActions } from '@actions';
import { Domains } from 'typings';
import { Consts } from '@constants';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: { borderRadius: 0, margin: spacing(2), width: 'auto' },
    table: {},
    margin: { margin: `0px ${spacing(2)}px` },
  })
);

const appState = (state: Domains.State) => state.app;
const resState = (state: Domains.State) => state.resources;

export const EC2 = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(appState);
  const { datas } = useSelector(resState);
  const actions = bindActionCreators(ResActions, dispatch);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rows = datas[Consts.SERVICES.EC2] ? datas[Consts.SERVICES.EC2] : [];

  // initialize
  React.useEffect(() => {
    if (!Object.keys(datas).includes(Consts.SERVICES.EC2)) {
      handleSearch();
      return;
    }

    setPage(0);
  }, []);

  const handleSearch = (userName?: string, instanceId?: string) => {
    actions.getResources('ec2');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log('row', rows);
  return (
    <React.Fragment>
      <Box display="flex" padding="16px 8px">
        <Box flexGrow={1}>
          <TextField className={classes.margin} label="Instance Id" />
          <TextField className={classes.margin} label="User Name" />
        </Box>
        <Button
          variant="contained"
          color="primary"
          className={classes.margin}
          onClick={() => {
            handleSearch();
          }}>
          Search
        </Button>
      </Box>
      <Divider />
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>User Name</StyledTableCell>
              <StyledTableCell>Create Time</StyledTableCell>
              <StyledTableCell>Instance Id</StyledTableCell>
              <StyledTableCell>Region</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`ec2${idx}`}>
                  <StyledTableCell component="th" scope="row">
                    {row.UserName}
                  </StyledTableCell>
                  <StyledTableCell>{row.EventTime}</StyledTableCell>
                  <StyledTableCell>{row.ResourceId}</StyledTableCell>
                  <StyledTableCell>{row.AWSRegion}</StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};
