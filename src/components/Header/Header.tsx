import {useContext} from "react";
import {DrawerContext} from "../../contexts/DrawerContext.tsx";
import {useTheme, useMediaQuery} from "@mui/material";
import {HeaderSearchBox} from "./HeaderSearchBox.tsx";
import HeaderLogo from "./HeaderLogo.tsx";
import HeaderProfileIcon from "./HeaderProfileIcon.tsx";
import SavedRecipesDrawer from "../SavedRecipesDrawer.tsx";

export const Header = () => {
    const theme = useTheme();
    const {drawerOpen, setDrawerOpen} = useContext(DrawerContext)
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
