import React from 'react';
import { useDispatch } from 'react-redux';
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
  Button,
  Grid,
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { AppActions } from '@actions';

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
    avatar: { margin: spacing(1), backgroundColor: palette.secondary.main },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: spacing(1),
    },
    submit: { margin: spacing(3, 0, 2) },
    button: { padding: spacing(0) },
  })
);

const SignIn = () => {
  const classes = useStyles();
  const actions = bindActionCreators(AppActions, useDispatch());
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    username: string;
    passwd: string;
  }>();

  const onSubmit = handleSubmit(({ username, passwd }) => {
    actions.signIn(username, passwd);
  });

  console.log(errors);

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
              />
            )}
          />
          <Controller
            name="passwd"
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
                autoFocus
                value={value}
                onChange={onChange}
              />
            )}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" size="large" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignIn;
