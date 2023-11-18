import useDrawer from "@context/DrawerProvider";
import {useTheme, useMediaQuery} from "@mui/material";
import {HeaderSearchBox} from "./HeaderSearchBox.tsx";
import HeaderLogo from "./HeaderLogo.tsx";
import HeaderProfileIcon from "./HeaderProfileIcon.tsx";
import SavedRecipesDrawer from "../SavedRecipesDrawer.tsx";

export function Header() {
    const theme = useTheme();
    const {drawerOpen, setDrawerOpen} = useDrawer();
    const isNotTablet = useMediaQuery(theme.breakpoints.up("lg"))

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen)
    }
    //TODO: See if we need the headerLogo props. Should we move the ContextUser inside the component instead? Any benefits?
    return (
        <>
            <SavedRecipesDrawer />
            <header className='header'>
                <HeaderLogo notTablet={isNotTablet} handleDrawerToggle={handleDrawerToggle}/>
                <HeaderSearchBox/>
                <HeaderProfileIcon />
            </header>
        </>
    );
};
