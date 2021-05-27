import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { ResActions } from '@actions';
import { XTable, XButton } from '@comp';
import { Consts } from '@constants';
import { Domains } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: { borderRadius: 0, margin: spacing(2), width: 'auto' },
    table: {},
    margin: { margin: `0px ${spacing(2)}px` },
    search: { width: spacing(15), paddingRight: spacing(3) },
  })
);

const appState = (state: Domains.State) => state.app;
const resState = (state: Domains.State) => state.resources;

export const RDS = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(appState);
  const { datas } = useSelector(resState);
  const actions = bindActionCreators(ResActions, dispatch);

  const [page, setPage] = React.useState(0);
  const rows = datas[Consts.SERVICES.RDS] ? datas[Consts.SERVICES.RDS] : [];

  // initialize
  React.useEffect(() => {
    if (!Object.keys(datas).includes(Consts.SERVICES.RDS)) {
      handleSearch();
      return;
    }

    setPage(0);
  }, []);

  const handleSearch = (userName?: string, instanceId?: string) => {
    actions.getResources('rds');
  };

  return (
    <React.Fragment>
      <Box display="flex" padding="16px">
        <Box flexGrow={1}>
          <TextField className={classes.margin} label="Database Name" />
          <TextField className={classes.margin} label="User Name" />
        </Box>
        <XButton
          isLoading={isLoading}
          variant="contained"
          color="primary"
          className={classes.search}
          onClick={() => {
            handleSearch();
          }}>
          Search
        </XButton>
      </Box>
      <Divider />
      <XTable
        headers={['User Name', 'Create Time', 'Identity ID', 'Region']}
        dataRows={rows.reduce((prev, curr) => {
          const row: string[] = [curr.UserName, curr.EventTime, curr.ResourceId, curr.AWSRegion];

          prev.push(row);

          return prev;
        }, [] as string[][])}
      />
    </React.Fragment>
  );
};
