import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useForm, Controller } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import { XButton } from '@comp';
import { AppActions } from '@actions';
import { Domains } from 'typings';

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
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

const appState = (state: Domains.State) => state.app;

const NewPassword = () => {
  const classes = useStyles();
  const actions = bindActionCreators(AppActions, useDispatch());
  const { userName, isLoading } = useSelector(appState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    oldpassword: string;
    newpassword: string;
    confirmpassword: string;
  }>();

  const onSubmit = handleSubmit(({ oldpassword, newpassword, confirmpassword }) => {
    actions.signIn(userName, oldpassword, newpassword);
  });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Controller
            name="oldpassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Old Password"
                autoFocus
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="newpassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="New Password"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="confirmpassword"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                label="Confirm Password"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <XButton
            isLoading={isLoading}
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Confirm
          </XButton>
        </form>
      </div>
    </Container>
  );
};

export default NewPassword;
