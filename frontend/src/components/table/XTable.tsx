import React, { FunctionComponent } from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Paper,
} from '@material-ui/core';

import StyledTableCell from './StyledTableCell';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: { borderRadius: 0, margin: spacing(2), width: 'auto' },
    table: {},
  })
);

const getKey = () => Math.random().toString(24).substring(2);

const XTable: FunctionComponent<TableProps> = ({ dataRows, headers, rowsPerPageOptions = [5, 10, 15] }) => {
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  /** page change event */
  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  /** rows change per page event */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <React.Fragment>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              {headers.map((item, idx) => (
                <StyledTableCell key={`h${getKey()}`}>{item}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={`r${getKey()}`}>
                  {row.map((item) => (
                    <StyledTableCell key={`c${getKey()}`}>{item}</StyledTableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={dataRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
};

export interface TableProps {
  headers: string[];
  dataRows: string[][];
  rowsPerPageOptions?: number[];
}

export default XTable;
