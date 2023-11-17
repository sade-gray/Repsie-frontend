import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header.tsx";
import { theme } from "../theme.ts";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider} from "../contexts/AuthContext.tsx";
import { DrawerProvider } from "../contexts/DrawerContext.tsx";
import { SnackBarProvider } from "../contexts/SnackBarContext.tsx";
import { UserDataProvider } from "../contexts/UserDataContext.tsx";
// import Footer from "./Footer.tsx";

export function Root() {

    return (
        <SnackBarProvider>
            <AuthProvider>
                <UserDataProvider>
                    <ThemeProvider theme={theme}>
                        {/* Drawer Context is only provided to the header to prevent refreshing the whole page.*/}
                        <DrawerProvider>
                            <Header/>
                        </DrawerProvider>
                        {/* Outlet is the child component to be rendered.*/}
                            <Outlet />
                        {/*<Footer/>*/}
                    </ThemeProvider>
                </UserDataProvider>
            </AuthProvider>
        </SnackBarProvider>
    )
}
