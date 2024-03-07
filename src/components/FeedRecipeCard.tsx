import { IconButton, Typography } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import { PublisherContainer } from '../routes/Recipe/components/PublisherContainer.tsx';
import React, { useEffect, useState } from 'react';
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

export default function FeedRecipeCard(props: RecipeCardData) {
  const [saved, setSaved] = useState(props.saved);
  const { user } = useAuth();
  const [image, setImage] = useState('');
  const { addSnack } = useSnackBar();
  const { setUserSavedRecipes } = useUserData();

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
  }, []);

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
    <article className={'feed--recipe--container'}>
      <div className={'feed--recipe--title--container'}>
        <Typography variant={'h4'} className={'recipe--title'}>
          {props.title}
        </Typography>
        <IconButton sx={{ marginRight: '0.5rem' }} onClick={e => handleSaveToggle(e)}>
          {saved ? (
            <BookmarkOutlinedIcon color={'secondary'} fontSize={'large'} />
          ) : (
            <BookmarkBorderOutlinedIcon color={'secondary'} fontSize={'large'} />
          )}
        </IconButton>
      </div>
      <PublisherContainer
        size={'small'}
        color={'gray'}
        // TODO: Update this when we have user profiles
        publisherImageUrl={props?.publisherImageUrl || Wex}
        publisherName={props.publisherName || 'Patriks'}
      />
      <div className={'feed--recipe--image--container'}>
        {/*TODO: Replace GourmetToastie with the recipe's image url*/}
        <img src={image} alt={'food pic'} />
      </div>
      <div className={'feed--recipe--action--row'}>
        <SkillRating value={props.skillRating} readOnly />
        <TimeRating value={props.timeRating} readOnly />
      </div>
    </article>
  );
}
