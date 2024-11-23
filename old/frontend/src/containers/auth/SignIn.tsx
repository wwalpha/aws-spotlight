import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm, Controller } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { AppActions } from '@actions';
import { XButton } from '@comp';
import { Domains } from 'typings';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    '@global': {
      body: { backgroundColor: palette.common.white },
    },
    paper: {
      marginTop: spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: { margin: spacing(1), backgroundColor: palette.primary.main },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: spacing(1),
    },
    submit: { margin: spacing(3, 0, 2) },
    button: { padding: spacing(0) },
  })
);

const appState = (state: Domains.State) => state.app;

const SignIn = () => {
  const classes = useStyles();
  const actions = bindActionCreators(AppActions, useDispatch());
  const { isLoading } = useSelector(appState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    username: string;
    password: string;
  }>();

  const onSubmit = handleSubmit(({ username, password }) => {
    actions.signIn(username, password);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={value}
                onChange={onChange}
                error={errors.username !== undefined}
                helperText={errors.username ? 'Required' : ''}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={value}
                onChange={onChange}
                error={errors.password !== undefined}
                helperText={errors.password ? 'Required' : ''}
              />
            )}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <XButton
            isLoading={isLoading}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign In
          </XButton>
          <Grid container>
            <Grid item xs></Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
