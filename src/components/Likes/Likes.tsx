import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import { LikesProps } from './likesTypes';
import { useEffect, useState } from 'react';

export default function Likes({ totalLikes, readOnly, liked, onClick }: LikesProps) {
  const [_liked, setLiked] = useState(liked);

  // Update the component whenever the liked prop changes
  useEffect(() => {
    setLiked(liked);
  }, [liked]);

  const handleClick = async (e: any, clickHandler: LikesProps['onClick']) => {
    if (!clickHandler) return;
    e.preventDefault();
    setLiked(prevLiked => !prevLiked);
    // If the function returned false, e.g. the website failed to like the post
    const success = await clickHandler();
    if (!success) {
      // Revert the change
      console.log('The like click handler returned false. Change reverted');
      setLiked(prevLiked => !prevLiked);
    }
  };

  return (
    <Box display={'flex'} alignItems={'center'} m={0.5}>
      {readOnly ? (
        _liked ? (
          <FavoriteIcon color="secondary" />
        ) : (
          <FavoriteBorderIcon color="secondary" />
        )
      ) : (
        <IconButton sx={{ p: 0 }} color={'secondary'} onClick={onClick ? e => handleClick(e, onClick) : undefined}>
          {_liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
      <Typography ml={0.5} color={'secondary.dark'} variant={'body2'}>
        {totalLikes}
      </Typography>
    </Box>
  );
}
