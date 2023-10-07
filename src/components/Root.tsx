import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header.tsx";
import { theme } from "../theme.ts";
import { ThemeProvider } from "@mui/material/styles";
import { DrawerContext } from "../contexts/DrawerContext.tsx";
import Footer from "./Footer.tsx";
import { useState } from "react";

export function Root() {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

    return (
        // Drawer Context is used by the Header component via the mobile drawer button
        // It is also used by the home page (To be added)
            <DrawerContext.Provider value={{drawerOpen, setDrawerOpen}}>
                <ThemeProvider theme={theme}>
                    <Header/>
                    {/* Outlet is the child component to be rendered.*/}
                    <Outlet />
                    <Footer/>
                </ThemeProvider>
            </DrawerContext.Provider>
    )
}
