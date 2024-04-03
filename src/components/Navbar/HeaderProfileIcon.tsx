import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RestaurantMenuOutlined, Logout, Person } from '@mui/icons-material';
import { ListItemIcon } from '@mui/material';
import useAuth from '@context/AuthProvider';
import useUserData from '@context/UserDataProvider';

export default function HeaderProfileIcon() {
  const { user, signOut } = useAuth();
  const { username } = useUserData();
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
            <Avatar sx={{ bgcolor: 'secondary' }} src={user?.photoURL || ''} alt={username} />
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
      >
        <Link to={user ? '/UserProfile/accountsettings' : '/signin'}>
          <MenuItem onClick={handleCloseUserMenu}>
            <Person sx={{ width: '35px', height: '35px', mr: 1, color: 'primary.dark' }} />
            <Typography>{user ? 'Profile' : 'Sign in'}</Typography>
          </MenuItem>
        </Link>
        {user && (
          <section>
            <Divider />
            <Link to="/myRecipes">
              <MenuItem onClick={handleCloseUserMenu}>
                <RestaurantMenuOutlined sx={{ width: '35px', height: '35px', mr: 1 }} color="primary" />
                <Typography color="text">My Recipes</Typography>
              </MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <Logout color="primary" sx={{ width: '35px', height: '35px', mr: 1 }} />
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
