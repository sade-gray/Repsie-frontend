import { AlertColor } from "@mui/material/Alert/Alert";

export interface snackContextValues {
  addSnack: (message: string, severity?: AlertColor | undefined) => void;
}

export interface snack {
  message: string;
  severity: AlertColor | undefined;
}
