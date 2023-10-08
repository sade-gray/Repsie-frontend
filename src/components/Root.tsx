import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header.tsx";
import { theme } from "../theme.ts";
import { ThemeProvider } from "@mui/material/styles";
import { DrawerProvider } from "../contexts/DrawerContext.tsx";
import Footer from "./Footer.tsx";

export function Root() {

    return (
        // Drawer Context is used by the Header component via the mobile drawer button
        // It is also used by the home page (To be added)
            <DrawerProvider>
                <ThemeProvider theme={theme}>
                    <Header/>
                    {/* Outlet is the child component to be rendered.*/}
                    <Outlet />
                    <Footer/>
                </ThemeProvider>
            </DrawerProvider>
    )
}
