import {createContext, useContext, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import {OverridableStringUnion} from "@mui/types";
import {AlertColor, AlertPropsColorOverrides} from "@mui/material/Alert/Alert";
// TODO: Implement a multiple snack functionality. Snack stack? Use 'notistack' package?

export const SnackBarContext = createContext({});

export function useSnackBar() {
    return useContext(SnackBarContext);
}

export default function SnackBarProvider({ children }: any) {
    // TODO: Add severity customization
    const [snack, setSnack] = useState({
        message: '',
        color: '',
    });
    const [open, setOpen] = useState<boolean>(false);

    const addSnack = (message: string, color: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>) => {
        console.log("Adding snack")
        setSnack({message: message, color: color});
        setOpen(true);
    }

    const value = {
        snack,
        addSnack
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <SnackBarContext.Provider value={value}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{horizontal: "right", vertical:"bottom"}}>
                <Alert severity={"success"} onClose={handleClose}>
                    {snack.message}
                </Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    )
}