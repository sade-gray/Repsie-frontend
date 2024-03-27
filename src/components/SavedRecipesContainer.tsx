import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import useUserData from '@context/UserDataProvider';
import toastie from '../assets/dummyPhotos/gourmet-toastie.jpg';
import { useEffect, useState } from 'react';
import { contentStorage } from '../firebase.ts';
import { getDownloadURL, ref } from 'firebase/storage';
import { RecipeCardData } from '../types/recipeTypes';
import { useNavigate } from 'react-router-dom';

/**
 * The list component used to display the saved recipes.
 * Currently, in use by the mobile drawer and home page.
 */
export default function SavedRecipesContainer(props: any) {
  // Get saved recipe items from context provider
  const { userSavedRecipes } = useUserData();

  const savedRecipeComponents = userSavedRecipes?.map((recipe, idx) => {
    return <SavedRecipeCard key={idx} {...recipe} closeDrawer={props.handleItemClick} />;
  });

  return (
    // TODO: Make the title sticky in the drawer. Make drawer round. Add swiping edge (like on iOS apps)
    <Stack gap={2} p={2} sx={{ position: 'sticky' }} flex={1} top={0}>
      {userSavedRecipes.length === 0 ? 'You have no recipes saved!' : savedRecipeComponents || 'Loading'}
    </Stack>
  );
}

export function SavedRecipeCard({ id, title, closeDrawer }: RecipeCardData & any) {
  const navigate = useNavigate();
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const imageRef = ref(contentStorage, `recipes/${id}/index.png`);
    getDownloadURL(imageRef)
      .then(url => setImage(url))
      .catch(() => setImage(toastie));
  }, [id]);

  return (
    <Card sx={{ borderRadius: 2, backgroundColor: 'secondary.main', maxWidth: 400 }} variant={'outlined'}>
      <CardActionArea
        onClick={() => {
          navigate(`/recipe/${id}`);
          closeDrawer();
        }}
      >
        <CardMedia component={'img'} height={100} image={image} alt={`Recipe image from ${title}`} />
        <CardContent sx={{ padding: 1, color: 'primary.main' }}>
          <Typography variant={'subtitle1'} mr={1}>
            {title}
          </Typography>
          <Typography variant={'body2'} component={'span'} fontSize={10} color={'primary.dark'}>
            by {username || 'Unknown'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
