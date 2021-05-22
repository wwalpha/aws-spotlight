import { Theme, createMuiTheme } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';

const theme: Theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    primary: {
      dark: '#003c8f',
      main: '#1565c0',
      light: '#5e92f3',
    },
    secondary: {
      dark: orange.A700,
      main: orange.A400,
      light: orange.A200,
    },
  },
});

export default theme;
