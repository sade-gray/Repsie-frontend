import {createContext, useContext, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import {AlertColor} from "@mui/material/Alert/Alert";
import { snack } from "../types/snack.ts";
// TODO: Implement a multiple snack functionality. Snack stack? Use 'notistack' package?

export const SnackBarContext = createContext({});

export function useSnackBar() {
    return useContext(SnackBarContext);
}

export default function SnackBarProvider({ children }: any) {
    // TODO: Add severity customization
    const [snack, setSnack] = useState<snack>({
        message: "",
        severity: "success"
    });
    const [open, setOpen] = useState<boolean>(false);

    const addSnack = (message: string, severity: AlertColor) => {
        setSnack({message: message, severity: severity || "success"});
        setOpen(true);
    }

    const value = {
        addSnack
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <SnackBarContext.Provider value={value}>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{horizontal: "right", vertical:"bottom"}}>
                <Alert severity={snack.severity} onClose={handleClose}>
                    {snack.message}
                </Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    )
}