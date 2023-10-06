import {IconButton} from "@mui/material";
import SavedRecipeDrawerIcon from "../SavedRecipeDrawerIcon.tsx";
import RepsieLogo from "./RepsieLogo.tsx";

export default function HeaderLogo(props:{notTablet: boolean, handleDrawerToggle: () => void}) {

    return (
        <div className='header--left'>
            {/* Display the toggle drawer button in the header for mobile */}
            {!props.notTablet &&
                <IconButton sx={{p: 0}} size={"small"} onClick={props.handleDrawerToggle}>
                    <SavedRecipeDrawerIcon/>
                </IconButton>
            }
            <RepsieLogo/>
        </div>
    )
}