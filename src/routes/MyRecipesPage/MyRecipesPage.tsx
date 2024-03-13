import SavedRecipesContainer from '../../components/SavedRecipesContainer';
import { useEffect, useState } from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography, useMediaQuery } from '@mui/material';
import useAuth from '@context/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCreatedRecipes } from '@api/recipe.ts';
import { RecipeCardData } from '../../types/recipeTypes';
import { contentStorage } from '../../firebase.ts';
import { getDownloadURL, ref } from 'firebase/storage';
import toastie from '../../assets/dummyPhotos/gourmet-toastie.jpg';
import SkillRating from '@component/Ratings/SkillRating';
import TimeRating from '@component/Ratings/TimeRating';
import { AddRounded } from '@mui/icons-material';
import { theme } from '../../theme.ts';
import Likes from '@component/Likes/Likes.tsx';
import { getPostLikes } from '@api/likes.ts';

export function MyRecipesPage() {
  // @ts-ignore
  const [createdRecipes, setCreatedRecipes] = useState<RecipeCardData[]>([]);
  const { user } = useAuth();
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));

  // Re fetch the recipes created by the user whenever the user changes
  useEffect(() => {
    if (!user) return;

    getCreatedRecipes(user.uid).then(createdRecipes => setCreatedRecipes(createdRecipes));
  }, [user]);

  // Redirect to home if user is not logged in
  if (!user) {
    return <Navigate to={'/'} />;
  }
  return (
    <div className="main--container">
      {isNotTablet && <SavedRecipesContainer />}
      <Box flex={4} px={1} m={1}>
        <Typography variant={'h4'}>My Recipes</Typography>
        <Grid container justifyContent={'flex-start'} spacing={5}>
          {createdRecipes?.map(recipe => (
            <Grid item key={recipe.id}>
              <RecipeCard {...recipe} />
            </Grid>
          ))}
          <Grid item>
            <CreateRecipeButton />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

function RecipeCard(props: RecipeCardData) {
  const [image, setImage] = useState('');
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate();

  // Get the recipe image on mount
  useEffect(() => {
    const imageRef = ref(contentStorage, `recipes/${props.id}/index.png`);
    getDownloadURL(imageRef)
      .then(url => setImage(url))
      .catch(() => setImage(toastie));

    getPostLikes(props.id).then(likes => setLikes(likes));
  }, []);

  return (
    <Card sx={{ width: 350, borderRadius: 3 }} variant={'outlined'}>
      <CardActionArea sx={{ position: 'relative' }} onClick={() => navigate(`/recipe/${props.id}`)}>
        <CardMedia component={'img'} height={150} image={image} />
        <Box position={'absolute'} top={125} bgcolor={'white'} borderRadius={2} right={0}>
          <Likes totalLikes={likes} readOnly />
        </Box>
        <CardContent>
          <Typography gutterBottom variant={'h5'}>
            {props.title}
          </Typography>
          <Grid container justifyContent={'space-between'}>
            <SkillRating value={props.skillRating} size={'small'} readOnly />
            <TimeRating value={props.timeRating} size={'small'} readOnly />
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function CreateRecipeButton() {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 350, height: 245, borderRadius: 3 }} variant={'outlined'}>
      <CardActionArea sx={{ height: '100%' }} onClick={() => navigate('/createrecipe')}>
        <Grid container alignItems={'center'} justifyContent={'center'} direction={'column'}>
          <AddRounded sx={{ width: '50%', height: '50%' }} color={'secondary'} />
          <Typography variant={'h4'} color={'secondary'}>
            Create
          </Typography>
        </Grid>
      </CardActionArea>
    </Card>
  );
}
