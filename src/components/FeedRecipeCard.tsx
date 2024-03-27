import { Card, CardActionArea, CardMedia, Divider, Grid, IconButton, Typography } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import { PublisherContainer } from '../routes/Recipe/components/PublisherContainer.tsx';
import React, { useEffect, useMemo, useState } from 'react';
import { RecipeCardData } from '../types/recipeTypes';
import useAuth from '@context/AuthProvider';
import useSnackBar from '@context/SnackBarProvider';
import useUserData from '@context/UserDataProvider';
import { saveRecipe, unsaveRecipe } from '@api/recipe.ts';
import SkillRating from './Ratings/SkillRating';
import TimeRating from './Ratings/TimeRating';
import Wex from '../assets/wex.png';
import toastie from '../assets/dummyPhotos/gourmet-toastie.jpg';
import { contentStorage } from '../firebase.ts';
import { getDownloadURL, ref } from 'firebase/storage';
import Likes from './Likes/Likes.tsx';
import { getPostLikes } from '@api/likes.ts';
import { useNavigate } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function FeedRecipeCard(props: RecipeCardData) {
  const [saved, setSaved] = useState(props.saved);
  const { user } = useAuth();
  const [image, setImage] = useState('');
  const [likes, setLikes] = useState(0);
  const { addSnack } = useSnackBar();
  const { setUserSavedRecipes, likedRecipes } = useUserData();
  const navigate = useNavigate();

  // This usEffect is used to initialise the state of the save button from the cloud
  useEffect(() => {
    setSaved(props.saved);
  }, [props.saved]);

  useEffect(() => {
    const imageRef = ref(contentStorage, `recipes/${props.id}/index.png`);
    // TODO: I cannot control the error logged by this function, so recipes without an image will flood the console.
    getDownloadURL(imageRef)
      .then(url => setImage(url))
      .catch(() => {
        setImage(toastie);
      });

    getPostLikes(props.id).then(likes => setLikes(likes));
  }, []);

  // Check if the user liked this recipe
  const likedByUser = useMemo(() => {
    return likedRecipes.find(recipeId => recipeId === props.id) !== undefined;
  }, [likedRecipes, props.id]);

  const handleSaveToggle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Prevent from being redirected to the recipe page
    e.preventDefault();
    // User must be logged in to save a recipe.
    if (!user) {
      addSnack('You must be signed in to save a recipe.', 'error');
      return;
    }

    if (!saved) {
      const success = await saveRecipe(props.id, user.uid);
      if (success) {
        setUserSavedRecipes((prevUserSavedRecipes: RecipeCardData[]) => {
          // we append the props as if it's a recipe card.
          return [...prevUserSavedRecipes, props];
        });
        addSnack('Success! Saved the recipe.', 'success');
      }
      setSaved(prevSaved => !prevSaved);
    } else {
      const success = await unsaveRecipe(props.id, user.uid);
      if (success) {
        setUserSavedRecipes((prevUserSavedRecipes: RecipeCardData[]) => {
          return prevUserSavedRecipes.filter(recipe => recipe.id !== props.id);
        });
        addSnack('Success! Unsaved the recipe.', 'success');
      }
    }
  };

  return (
    <Card sx={{ p: 1, boxShadow: 'none' }}>
      <Grid container justifyContent={'space-between'}>
        <Typography variant={'h4'} m={0.5}>
          {props.title}
        </Typography>
        <IconButton
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </Grid>
      <CardActionArea onClick={() => navigate(`/recipe/${props.id}`)}>
        <PublisherContainer
          size={'small'}
          // TODO: Update this when we have user profiles
          publisherImageUrl={Wex}
          publisherName={'Patriks'}
        />

        <CardMedia sx={{ borderRadius: 2 }} component={'img'} image={image} alt="food pic" />

        {/* Time and skill rating section */}
        <Grid container justifyContent={'space-between'} my={1}>
          <Grid item>
            <SkillRating value={props.skillRating} size="large" readOnly />
          </Grid>
          <Grid item>
            <TimeRating value={props.timeRating} size="large" readOnly />
          </Grid>
        </Grid>
      </CardActionArea>

      {/* Action row */}
      <Grid container justifyContent={'space-between'}>
        <Likes totalLikes={likes} readOnly liked={likedByUser} />
        <IconButton sx={{ marginRight: '0.5rem' }} onClick={e => handleSaveToggle(e)}>
          {saved ? (
            <BookmarkOutlinedIcon color={'secondary'} fontSize={'large'} />
          ) : (
            <BookmarkBorderOutlinedIcon color={'secondary'} fontSize={'large'} />
          )}
        </IconButton>
      </Grid>
      <Divider />
    </Card>
  );
}
