import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import avatar from '../../assets/wex.png';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RestaurantMenuOutlined, Logout } from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';
import useAuth from '@context/AuthProvider';

export default function HeaderProfileIcon() {
  const { user, signOut } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleLogoutClick = () => {
    handleCloseUserMenu();
    signOut();
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton sx={{ paddingRight: 1 }} onClick={handleOpenUserMenu}>
            {/* TODO: Fetch avatar image from database */}
            <Avatar src={user?.photoURL || avatar} alt="user logo" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorElUser}
        keepMounted
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        // This is the styling for the menu options
        slotProps={{
          paper: {
            sx: {
              '& .MuiAvatar-root': {
                mr: 1,
                height: 35,
              },
            },
          },
        }}
      >
        <Link to={user ? '/UserProfile/accountsettings' : '/signin'}>
          <MenuItem onClick={handleCloseUserMenu}>
            <Avatar sx={{ width: '35px', height: '35px' }} />
            <Typography color="text">{user ? 'Profile' : 'Sign in'}</Typography>
          </MenuItem>
        </Link>
        {user && (
          <section>
            <Divider />
            <Link to="/myRecipes">
              <MenuItem onClick={handleCloseUserMenu}>
                <RestaurantMenuOutlined sx={{ width: '35px', height: '35px', mr: 1 }} color="secondary" />
                <Typography color="text">My Recipes</Typography>
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <Logout sx={{ width: '35px', height: '35px', mr: 1 }} color="secondary" />
              </ListItemIcon>
              <Typography color="text">Logout</Typography>
            </MenuItem>
          </section>
        )}
        {/*{!user && <section>*/}
        {/*  <MenuItem>*/}
        {/*    <ListItemIcon>*/}

        {/*    </ListItemIcon>*/}
        {/*  </MenuItem>*/}
        {/*</section>*/}
      </Menu>
    </div>
  );
}
