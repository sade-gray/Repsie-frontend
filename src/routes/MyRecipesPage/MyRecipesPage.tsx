import SavedRecipesContainer from '../../components/SavedRecipesContainer';
import { useEffect, useState } from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import useAuth from '@context/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { deleteRecipe, getCreatedRecipes } from '@api/recipe.ts';
import { RecipeCardData } from '../../types/recipeTypes';
import { contentStorage } from '../../firebase.ts';
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import toastie from '../../assets/dummyPhotos/gourmet-toastie.jpg';
import SkillRating from '@component/Ratings/SkillRating';
import TimeRating from '@component/Ratings/TimeRating';
import { AddRounded, Delete, Edit } from '@mui/icons-material';
import { theme } from '../../theme.ts';
import Likes from '@component/Likes/Likes.tsx';
import { getPostLikes } from '@api/likes.ts';
import useSnackBar from '@context/SnackBarProvider';

export function MyRecipesPage() {
  const [createdRecipes, setCreatedRecipes] = useState<RecipeCardData[]>([]);
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useAuth();
  const { addSnack } = useSnackBar();

  // Re fetch the recipes created by the user whenever the user changes
  useEffect(() => {
    if (!user) return;

    getCreatedRecipes(user.uid).then(createdRecipes => setCreatedRecipes(createdRecipes));
  }, [user]);

  // Redirect to home if user is not logged in
  if (!user) {
    addSnack('You must be logged in to view your recipes', 'warning');
    return <Navigate to={'/'} />;
  }

  const removeRecipe = (recipeId: string) => {
    setCreatedRecipes(createdRecipes.filter(recipe => recipe.id !== recipeId));
  };

  return (
    <div className="main--container">
      {isNotTablet && <SavedRecipesContainer />}
      <Box flex={4} px={1} m={1}>
        <Typography variant={'h4'}>My Recipes</Typography>
        <Grid container justifyContent={'flex-start'} spacing={5}>
          {createdRecipes?.map(recipe => (
            <Grid item key={recipe?.id}>
              <RecipeCard {...recipe} removeRecipe={removeRecipe} />
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
  const { addSnack } = useSnackBar();
  const { user } = useAuth();

  // Get the recipe image on mount
  useEffect(() => {
    const imageRef = ref(contentStorage, `recipes/${props.id}/index.png`);
    getDownloadURL(imageRef)
      .then(url => setImage(url))
      .catch(() => setImage(toastie));

    getPostLikes(props.id).then(likes => setLikes(likes));
  }, []);

  const handleDelete = () => {
    if (!user) {
      addSnack('You must be logged in to delete a recipe', 'warning');
      return;
    }
    if (user.uid !== props.userId) {
      addSnack('You do not have permission to delete this recipe', 'warning');
      return;
    }

    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(props.id, props.userId).then(res => {
        if (res.error) {
          addSnack('Error deleting recipe', 'error');
        } else {
          addSnack('Recipe deleted', 'success');
          props.removeRecipe(props.id);
          // Delete the image from storage
          const imageRef = ref(contentStorage, `recipes/${props.id}/index.png`);
          deleteObject(imageRef)
            .then(() => {
              setImage('');
            })
            .catch(e => console.error(e));
        }
      });
    }
  };

  return (
    <Card sx={{ width: 350, borderRadius: 3 }} variant={'outlined'}>
      <CardActionArea sx={{ position: 'relative' }} onClick={() => navigate(`/recipe/${props.id}`)}>
        {/* Recipe image */}
        <CardMedia component={'img'} height={150} image={image} />
        {/* Likes */}
        <Box position={'absolute'} top={125} bgcolor={'white'} borderRadius={2} right={0}>
          <Likes totalLikes={likes} readOnly />
        </Box>
      </CardActionArea>
      <CardContent>
        <Box display={'flex'} justifyContent={'space-between'}>
          {/* Title */}
          <Box>
            <Typography gutterBottom variant={'h5'}>
              {props.title || 'No title'}
            </Typography>
          </Box>
          {/* Edit and delete buttons */}
          <Box>
            <IconButton onClick={handleDelete} sx={{ borderRadius: 4, gap: 0.5 }}>
              <Delete />
            </IconButton>
            <IconButton onClick={() => navigate(`/createRecipe/${props.id}`)} sx={{ borderRadius: 4, gap: 0.5 }}>
              <Edit />
            </IconButton>
          </Box>
        </Box>
        {/* Skill ratings */}
        <Grid container justifyContent={'space-between'}>
          <SkillRating value={props.skillRating} size={'small'} readOnly />
          <TimeRating value={props.timeRating} size={'small'} readOnly />
        </Grid>
      </CardContent>
    </Card>
  );
}

function CreateRecipeButton() {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: 350, height: 245, borderRadius: 3 }} variant={'outlined'}>
      <CardActionArea sx={{ height: '100%' }} onClick={() => navigate('/createRecipe/new')}>
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
