import useDrawer from '@context/DrawerProvider';
import { useTheme, useMediaQuery, useScrollTrigger, AppBar, IconButton, Grid } from '@mui/material';
import { HeaderSearchBox } from './HeaderSearchBox.tsx';
import HeaderProfileIcon from './HeaderProfileIcon.tsx';
import SavedRecipesDrawer from '../SavedRecipesDrawer.tsx';
import React, { ReactElement } from 'react';
import SavedRecipeDrawerIcon from '@component/SavedRecipeDrawerIcon.tsx';
import RepsieLogo from '@component/Navbar/RepsieLogo.tsx';

export function DesktopNavbar() {
  const theme = useTheme();
  const { drawerOpen, setDrawerOpen } = useDrawer();
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  //TODO: See if we need the headerLogo props. Should we move the ContextUser inside the component instead? Any benefits?
  return (
    <>
      <SavedRecipesDrawer />
      <ElevationScroll>
        <AppBar color={'secondary'} position={'sticky'}>
          <Grid container justifyContent={'space-between'} alignItems={'center'} p={1}>
            {/* Display the toggle drawer button in the header for mobile */}
            <Grid item>
              {!isNotTablet && (
                <IconButton sx={{ p: 0 }} size={'small'} onClick={handleDrawerToggle}>
                  <SavedRecipeDrawerIcon />
                </IconButton>
              )}
              <RepsieLogo />
            </Grid>
            <Grid item>
              <HeaderSearchBox />
            </Grid>
            <Grid item>
              <HeaderProfileIcon />
            </Grid>
          </Grid>
        </AppBar>
      </ElevationScroll>
    </>
  );
}

function ElevationScroll({ children }: { children: ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window || undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
