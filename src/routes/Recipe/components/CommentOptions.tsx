import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useAuth from '@context/AuthProvider';
import { deleteComment } from '@api/comments.ts';
import { ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import useSnackBar from '@context/SnackBarProvider';

export default function CommentOptions(props: any) {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { addSnack } = useSnackBar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleClose();
    deleteComment(props.recipeId, props.id).then(success => {
      if (success) {
        props.removeComment(props.id);
        addSnack('Comment deleted', 'success');
      } else {
        addSnack('There was a problem deleting your comment', 'error');
      }
    });
  };

  return (
    <div>
      <IconButton
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ borderRadius: 4, gap: 0.5 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {/*  Options if the user is the commenter */}
        {user?.uid === props.userId ? (
          [
            <MenuItem key={0} onClick={handleDeleteClick}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>,
          ]
        ) : (
          // Options if the user is NOT the commenter
          <MenuItem key={1} color={'error'}>
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText>Report</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
