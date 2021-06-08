import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import moment from 'moment-timezone';
import orderBy from 'lodash/orderBy';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RefreshIcon from '@material-ui/icons/Refresh';
import { XButton, XTable } from '@comp';
import { ResActions } from '@actions';
import { Domains } from 'typings';
import { filter } from 'lodash';

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    container: { borderRadius: 0, margin: spacing(2), width: 'auto' },
    search: {
      borderRadius: 0,
      backgroundColor: palette.success.main,
      minWidth: spacing(5),
      width: spacing(5),
      height: spacing(5),
      margin: '0px',
      '&:hover': {
        backgroundColor: palette.success.dark,
      },
    },
    loadingContainer: { marginRight: spacing(3) },
    formControl: { margin: spacing(1), minWidth: spacing(30) },
    select: {
      padding: `${spacing(2)}px ${spacing(1.5)}px`,
    },
  })
);

const appState = (state: Domains.State) => state.app;
const resState = (state: Domains.State) => state.resources;

const Service = () => {
  const [dataRows, setDataRows] = useState([] as string[][]);
  const [serviceList, setServiceList] = useState([] as string[]);
  const [usernameList, setUsernameList] = useState([] as string[]);
  const [service, setService] = useState('ALL');
  const [username, setUsername] = useState('ALL');
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
    }
  }, [eventSource]);

  // pathname change
  React.useEffect(() => {
    // reset filter
    setService('ALL');
    setUsername('ALL');
  }, [pathname]);

  React.useEffect(() => {
    let filtered = rows;

    // filter
    if (service !== 'ALL') {
      filtered = filter(filtered, ['Service', service]);
    }
    if (username !== 'ALL') {
      filtered = filter(filtered, ['UserName', username]);
    }

    // sort by service name
    const sorted = orderBy(filtered, ['Service'], ['asc']);
    // convert to display datas
    const datas = sorted.reduce((prev, curr) => {
      const eventTime = moment(curr.EventTime).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
      const row: string[] = [curr.Service, curr.UserName, curr.ResourceName, curr.AWSRegion, eventTime];

      prev.push(row);

      return prev;
    }, [] as string[][]);

    setDataRows(datas);

    // select list
    const services = Array.from(new Set(rows.map((item) => item.Service)));
    const usernames = Array.from(new Set(rows.map((item) => item.UserName)));

    setServiceList(services);
    setUsernameList(usernames);
  }, [datas, service, username, pathname]);

  const handleSearch = () => {
    actions.getResources(serviceName);
  };

  const handleServiceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setService(event.target.value as string);
  };
  const handleUsernameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUsername(event.target.value as string);
  };

  return (
    <React.Fragment>
      <Box display="flex" padding="16px 8px 8px 8px" alignItems="center">
        <Box flexGrow={1}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Service</InputLabel>
            <Select
              value={service}
              onChange={handleServiceChange}
              label="Service"
              classes={{
                outlined: classes.select,
              }}>
              <MenuItem value="ALL">
                <em>ALL</em>
              </MenuItem>
              {serviceList.map((item, idx) => (
                <MenuItem key={`${item}${idx}`} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Username</InputLabel>
            <Select
              value={username}
              onChange={handleUsernameChange}
              label="Username"
              classes={{
                outlined: classes.select,
              }}>
              <MenuItem value="ALL">
                <em>ALL</em>
              </MenuItem>
              {usernameList.map((item, idx) => (
                <MenuItem key={`${item}${idx}`} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <XButton
          isLoading={isLoading}
          fullWidth={false}
          variant="contained"
          color="primary"
          className={classes.search}
          containerClassName={classes.loadingContainer}
          onClick={handleSearch}>
          <RefreshIcon />
        </XButton>
      </Box>
      <Divider />
      <XTable headers={['Service', 'User Name', 'Instance ID', 'Region', 'Create Time']} dataRows={dataRows} />
    </React.Fragment>
  );
};

export default Service;
