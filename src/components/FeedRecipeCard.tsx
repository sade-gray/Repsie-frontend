import { IconButton, Typography } from '@mui/material';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import { PublisherContainer } from '../routes/Recipe/components/PublisherContainer.tsx';
import React, { useEffect, useState } from 'react';
import { RecipeCardData } from '../types/recipeTypes';
import useAuth from '@context/AuthProvider';
import useSnackBar from '@context/SnackBarProvider';
import useUserData from '@context/UserDataProvider';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase.ts';
import SkillRating from './Ratings/SkillRating';
import TimeRating from './Ratings/TimeRating';

export default function FeedRecipeCard(props: RecipeCardData) {
  const [saved, setSaved] = useState(props.saved);
  const { user } = useAuth();
  const { addSnack } = useSnackBar();
  const { setUserSavedRecipes } = useUserData();

  // This usEffect is used to initialise the state of the save button from the cloud
  useEffect(() => {
    setSaved(props.saved);
  }, [props.saved]);

  const handleSaveToggle = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // Prevent from being redirected to the recipe pag
    e.preventDefault();
    // User must be logged in to save a recipe.
    if (!user) {
      addSnack('You must be signed in to save a recipe.', 'error');
      return;
    }
    // Get a reference to the current recipe
    const userSavedRecipesDocRef = doc(db, `userSavedRecipes/${user.uid}`);
    // Create the document if it does not exist.
    await getDoc(userSavedRecipesDocRef).then((doc) => {
      if (!doc.exists()) {
        console.log('Creating new doc');
        setDoc(userSavedRecipesDocRef, {
          recipeRefs: [props.id],
        }).then(() => {
          addSnack('Success! Saved the recipe.', 'success');
        });
        return;
      }
    });
    if (!saved) {
      await updateDoc(userSavedRecipesDocRef, {
        recipeRefs: arrayUnion(props.id),
      }).then(() => {
        setUserSavedRecipes((prevUserSavedRecipes: string[]) => {
          return [...prevUserSavedRecipes, props.id];
        });
        addSnack('Success! Saved the recipe.', 'success');
      });
    } else {
      await updateDoc(userSavedRecipesDocRef, {
        recipeRefs: arrayRemove(props.id),
      }).then(() => {
        addSnack('Success! Unsaved the recipe.', 'success');
        setUserSavedRecipes((prevUserSavedRecipes: string[]) => {
          return prevUserSavedRecipes.filter((id) => id !== props.id);
        });
      });
    }
    setSaved((prevSaved) => !prevSaved);
  };

  return (
    <article className={'feed--recipe--container'}>
      <div className={'feed--recipe--title--container'}>
        <Typography variant={'h4'} className={'recipe--title'}>
          {props.title}
        </Typography>
        <IconButton
          sx={{ marginRight: '0.5rem' }}
          onClick={(e) => handleSaveToggle(e)}
        >
          {saved ? (
            <BookmarkOutlinedIcon color={'secondary'} fontSize={'large'} />
          ) : (
            <BookmarkBorderOutlinedIcon
              color={'secondary'}
              fontSize={'large'}
            />
          )}
        </IconButton>
      </div>
      <PublisherContainer
        size={'small'}
        color={'gray'}
        publisherImageUrl={props.publisherImageUrl}
        publisherName={props.publisherName}
      />
      <div className={'feed--recipe--image--container'}>
        <img src={props.imageUrl} alt={'food pic'} />
      </div>
      <div className={'feed--recipe--action--row'}>
        <SkillRating value={props.skillRating} readOnly />
        <TimeRating value={props.timeRating} readOnly />
      </div>
    </article>
  );
}
