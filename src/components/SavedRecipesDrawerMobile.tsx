import useDrawer from '@context/DrawerProvider';
import { Grid, styled, SwipeableDrawer, Typography} from '@mui/material';
import SavedRecipesContainer from '@component/SavedRecipesContainer.tsx';
import {grey} from '@mui/material/colors';

export default function SavedRecipesDrawerMobile(props: any) {
  const { window } = props;
  const {drawerOpen, setDrawerOpen} = useDrawer();

  const handleDrawerToggle = () => {setDrawerOpen(!drawerOpen)};
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <SwipeableDrawer container={container} anchor={"bottom"} variant={"temporary"} open={drawerOpen}
        onOpen={handleDrawerToggle}
        onClose={handleDrawerToggle}

       // Stylesheet for the drawer
        sx={{
          display:{lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            minHeight: "75vh",
            borderRadius: "1em 1em 0 0",
            paddingX: 2,
          },
        }}
    >
      {/* Contents go here */}
      <Grid container alignItems={"center"} paddingTop={1} direction={"column"} position={"sticky"} top={0} zIndex={10}
        sx={{background:"inherit"}}>
        <Puller />
        <Typography variant={"h4"} sx={{p:1}}>Saved Recipes</Typography>
      </Grid>
      <SavedRecipesContainer />
    </SwipeableDrawer>
  )
}

const Puller = styled('div')(({ theme }) => ({
  width: 60,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
}));
