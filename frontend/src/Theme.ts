import { createMuiTheme, Theme } from '@material-ui/core/styles';

const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    primary: {
      dark: '#4d1e65',
      main: '#6F2C91',
      light: '#8b56a7',
    },
    secondary: {
      dark: '#101010',
      main: '#171717',
      light: '#454545',
    },
  },
});

export default theme;
