import {
    SwipeableDrawer,
    Box
} from "@mui/material";
import { useContext } from "react";
import { DrawerContext } from "../contexts/DrawerContext.tsx";
import SavedRecipesContainer from "./SavedRecipesContainer.tsx";

interface Props {
    window?: () => Window;
}
const drawerWidth: number = 300;
/**
 * 
 * This is the saved recipes drawer for mobile.
 */
export default function SavedRecipesDrawer(props: Props) {
    const {window} = props;

    // The logic for turning the saved recipes data into react components

    // TODO: Add specific type to this context
    const {drawerOpen, setDrawerOpen}: any = useContext(DrawerContext)
    const handleDrawerToggle = () => {setDrawerOpen(!drawerOpen)}

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer */}
                <SwipeableDrawer
                    container={container}
                    variant="temporary"
                    open={drawerOpen}
                    onOpen={handleDrawerToggle}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display:{lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {/* Contents go here */}
                    <SavedRecipesContainer />
                </SwipeableDrawer>
            </Box>
        </Box>
    );
}
