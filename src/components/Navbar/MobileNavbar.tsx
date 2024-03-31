import { AppBar, Box, Fab, Grid, IconButton, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SavedRecipesDrawerMobile from '@component/SavedRecipesDrawerMobile.tsx';
import useDrawer from '@context/DrawerProvider';
import { AccountMenu } from '@component/Navbar/AccountMenu.tsx';
import { MobileNavbarSearch } from './MobileNavbarSearch';

export default function MobileNavbar() {
  const { drawerOpen, setDrawerOpen } = useDrawer();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Grid container justifyContent={'space-around'} alignItems={'center'}>
          {/* Home button */}
          <IconButton color={'inherit'} aria-label="open drawer" size={'large'}>
            <Link to={'/'} aria-label={'home'} style={{ lineHeight: 0 }}>
              <HomeIcon fontSize={'large'} />
            </Link>
          </IconButton>
          {/* Search Button */}
          <MobileNavbarSearch />
          {/* Create Recipe button */}
          <StyledFab color="primary" aria-label="add">
            <Link to={'/createRecipe/new'} style={{ lineHeight: 0 }}>
              <AddIcon fontSize={'large'} />
            </Link>
          </StyledFab>
          {/* A simple divider */}
          <Box sx={{ flexGrow: 0.3 }} />
          {/* Saved Recipes Icon */}
          <IconButton color={'inherit'} onClick={handleDrawerToggle}>
            <BookmarkIcon fontSize={'large'} />
          </IconButton>
          <AccountMenu />
        </Grid>
      </AppBar>
      <SavedRecipesDrawerMobile window={() => window} />
    </>
  );
}

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -10,
  left: 0,
  right: 0,
  margin: '0 auto',
});
