import {Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import avatar from "../../assets/wex.png";
import React, {useState} from "react";
import { Link } from "react-router-dom";
import { RestaurantMenuOutlined, Logout } from "@mui/icons-material";
import { ListItemIcon } from "@mui/material";

export default function HeaderProfileIcon() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <div className='header--right'>
            <Box sx={{flexGrow: 0}}>
                <Tooltip title='Open settings'>
                    <IconButton sx={{paddingRight: 2.5}} onClick={handleOpenUserMenu}>
                        {/* Fetch avatar image from database */}
                        <Avatar alt='user logo' src={avatar}/>
                    </IconButton>
                </Tooltip>
            </Box>
                <Menu sx={{
                        mt: "45px",

                      }}
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                      }}
                    keepMounted
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    slotProps={{ 
                        // This is the styling for the menu options  
                        paper: {
                            sx: {
                                "& .MuiAvatar-root": {
                                    mr:1,
                                    height: 35,
                                },
                            }
                        }}
                    }
                >
                    <Link to="/">
                        <MenuItem>
                            <Avatar sx={{ width: "35px", height: "35px"}}/>
                            <Typography color="text">Profile</Typography>
                        </MenuItem>
                    </Link>
                    <Divider />
                    <Link to="/myRecipes">
                        <MenuItem>
                                <RestaurantMenuOutlined sx={{width: "35px", height: "35px", mr:1}} color="secondary"/>
                                <Typography color="text">My Recipes</Typography>
                        </MenuItem>
                    </Link>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <Logout sx={{width: "35px", height: "35px", mr:1}} color="secondary" />
                        </ListItemIcon>
                        <Typography color="text">Logout</Typography>
                    </MenuItem>
                </Menu>
        </div>
    )
}