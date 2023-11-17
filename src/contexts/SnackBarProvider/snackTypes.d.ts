import {AlertColor} from "@mui/material/Alert/Alert";

export interface snackContextValues {
    /**
     * Adds a snack to the bottom right of the screen
     * @param message
     * @param severity
     */
    addSnack: (message: string, severity?: AlertColor | undefined) => void
}

export interface snack {
    message: string,
    severity: AlertColor | undefined
}
