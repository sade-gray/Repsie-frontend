import { createContext, ReactNode, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { AlertColor } from '@mui/material/Alert/Alert';
import { snack } from './snackTypes';
import { snackContextValues } from './snackTypes';
// TODO: Implement a multiple snack functionality. Snack stack? Use 'notistack' package?

export const SnackBarContext = createContext({} as snackContextValues);

export function SnackBarProvider({ children }: { children: ReactNode }) {
  const [snack, setSnack] = useState<snack>({
    message: '',
    severity: 'success',
  });
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Adds a snack to the snack bar on the bottom right of the screen
   * @param message
   * @param severity
   */
  const addSnack = (message: string, severity?: AlertColor) => {
    setSnack({ message: message, severity: severity || 'success' });
    setOpen(true);
  };

  const value: snackContextValues = {
    addSnack,
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackBarContext.Provider value={value}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert severity={snack.severity} onClose={handleClose}>
          {snack.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackBarContext.Provider>
  );
}
