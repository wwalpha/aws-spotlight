import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { XButton, XTable } from '@comp';
import { ResActions } from '@actions';
import { Consts } from '@constants';
import { Domains } from 'typings';

const useStyles = makeStyles(({ spacing }: Theme) =>
  createStyles({
    container: { borderRadius: 0, margin: spacing(2), width: 'auto' },
    table: {},
    margin: { margin: `0px ${spacing(2)}px` },
    search: { width: spacing(15) },
  })
);

const appState = (state: Domains.State) => state.app;
const resState = (state: Domains.State) => state.resources;

const Service = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(appState);
  const { datas } = useSelector(resState);
  const actions = bindActionCreators(ResActions, dispatch);
  const serviceName = pathname.split('/')[pathname.split('/').length - 1];
  const eventSource = `${serviceName}.amazonaws.com`;
  const rows = datas[eventSource] ? datas[eventSource] : [];

  // initialize
  React.useEffect(() => {
    if (!Object.keys(datas).includes(eventSource)) {
      handleSearch();
      console.log('search');
    }
  }, [eventSource]);

  const handleSearch = (userName?: string, instanceId?: string) => {
    actions.getResources(serviceName);
  };

  return (
    <React.Fragment>
      <Box display="flex" padding="16px 8px">
        <Box flexGrow={1}>
          <TextField className={classes.margin} label="Instance Id" />
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
        headers={['User Name', 'Create Time', 'Instance ID', 'Region']}
        dataRows={rows.reduce((prev, curr) => {
          const row: string[] = [curr.UserName, curr.EventTime, curr.ResourceId, curr.AWSRegion];

          prev.push(row);

          return prev;
        }, [] as string[][])}
      />
    </React.Fragment>
  );
};

export default Service;
