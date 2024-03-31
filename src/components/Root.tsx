import { Outlet } from 'react-router-dom';
import { DesktopNavbar } from './Navbar/DesktopNavbar.tsx';
import MobileNavbar from './Navbar/MobileNavbar.tsx';
import { useTheme } from '@mui/material/styles';
import { AuthProvider } from '@context/AuthProvider';
import { DrawerProvider } from '@context/DrawerProvider';
import { SnackBarProvider } from '@context/SnackBarProvider/SnackBarContext.tsx';
import { UserDataProvider } from '@context/UserDataProvider/UserDataContext.tsx';
import { useMediaQuery } from '@mui/material';
import { ColorModeProvider } from '@context/ColorModeProvider';
// import Footer from "./Footer.tsx";

export function Root() {
  const theme = useTheme();
  return (
    <SnackBarProvider>
      <AuthProvider>
        <UserDataProvider>
          <ColorModeProvider>
            {/* Drawer Context is only provided to the header to prevent refreshing the whole page.*/}
            <DrawerProvider>{useMediaQuery(theme.breakpoints.up('sm')) ? <DesktopNavbar /> : <MobileNavbar />}</DrawerProvider>
            {/* Outlet is the child component to be rendered.*/}
            <Outlet />
            {/*<Footer/>*/}
          </ColorModeProvider>
        </UserDataProvider>
      </AuthProvider>
    </SnackBarProvider>
  );
}
