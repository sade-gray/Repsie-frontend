import {Outlet} from "react-router-dom";
import {Header} from "./Header/Header.tsx";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../theme.ts";
import Footer from "./Footer.tsx";
import {Dispatch, SetStateAction, useState} from "react";
import {createContext} from "react";


interface IContextType {
    drawerOpen: boolean;
    setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerContext = createContext<IContextType>({
    drawerOpen: false,
    setDrawerOpen: () => {},
});

export function Root() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    return (
        // Drawer Context is used by the Header component via the mobile drawer button
        // It is also used by the home page (To be added)
        <DrawerContext.Provider value={{drawerOpen, setDrawerOpen}}>
            <ThemeProvider theme={theme}>
                <Header/>
                {/* Outlet is basically the child component to be rendered.*/}
                <Outlet />
                <Footer/>
            </ThemeProvider>
        </DrawerContext.Provider>
    )
}
