import { grey, deepPurple } from '@mui/material/colors';
import { PaletteMode } from '@mui/material';

/*
About theme:
This is where the website's theme is defined. It currently has two modes: light and dark
For both light and dark mode, the primary color is purple.
*/

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: deepPurple[500],
            dark: deepPurple[600],
          },
          secondary: {
            main: grey[50],
            dark: grey[500],
          },
          text: {
            primary: grey[900],
          },
          background: {
            default: grey[50],
            paper: grey[50],
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: deepPurple[500],
            dark: deepPurple[600],
          },
          secondary: {
            main: grey[50],
            dark: grey[500],
          },
          background: {
            default: grey[900],
            paper: grey[700],
          },
          text: {
            primary: grey[50],
            dark: grey[200],
          },
        }),
  },
});
