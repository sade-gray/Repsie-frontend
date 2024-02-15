import { Outlet } from "react-router-dom";
import { DesktopNavbar } from "./Navbar/DesktopNavbar.tsx";
import MobileNavbar from "./Navbar/MobileNavbar.tsx";
import { theme } from "../theme.ts";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider} from "@context/AuthProvider";
import { DrawerProvider } from "@context/DrawerProvider";
import { SnackBarProvider } from "@context/SnackBarProvider/SnackBarContext.tsx";
import { UserDataProvider } from "@context/UserDataProvider/UserDataContext.tsx";
import { useMediaQuery } from '@mui/material';
// import Footer from "./Footer.tsx";

export function Root() {
  return (
    <SnackBarProvider>
      <AuthProvider>
        <UserDataProvider>
          <ThemeProvider theme={theme}>
            {/* Drawer Context is only provided to the header to prevent refreshing the whole page.*/}
            <DrawerProvider>
              {useMediaQuery(theme.breakpoints.up("sm")) ? <DesktopNavbar /> : <MobileNavbar />}
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
