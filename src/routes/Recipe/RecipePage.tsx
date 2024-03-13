import { PublisherContainer } from './components/PublisherContainer.tsx';
import Wex from '../../assets/wex.png';
import toastie from '../../assets/dummyPhotos/gourmet-toastie.jpg';
import { getDownloadURL } from 'firebase/storage';
import { Box, Container, Divider, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ref } from 'firebase/storage';
import { contentStorage } from '../../firebase.ts';
import Editor from '../CreateRecipe/components/Editor.tsx';
import { theme } from '../../theme.ts';
import SkillRating from '@component/Ratings/SkillRating';
import TimeRating from '@component/Ratings/TimeRating/TimeRating.tsx';
import CommentSection from '../MyRecipesPage/Components/CommentSection.tsx';
import useSnackBar from '@context/SnackBarProvider';
import { fetchRecipe } from '@api/recipe.ts';
import Likes from '@component/Likes';
import useUserData from '@context/UserDataProvider/useUserData.ts';
import useAuth from '@context/AuthProvider/useAuth.ts';
import { getPostLikes, likeRecipe, unlikeRecipe } from '@api/likes.ts';

export function RecipePage() {
  const recipeId = useParams()['recipeId'] || '';
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [recipe, setRecipe] = useState<any>();
  const [likes, setLikes] = useState(0);
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const { addSnack } = useSnackBar();
  const { user } = useAuth();
  const { likedRecipes, setLikedRecipes } = useUserData();

  // Check if the user likes this recipe
  const likedByUser = useMemo(() => {
    if (!user || !recipeId) return false;
    console.log('checking if user likes this');
    return likedRecipes.includes(recipeId);
    // TODO: uncomment this should the api return recipe card data instead of just ids
    // return likedRecipes?.find(recipe => recipe.id === recipeId) !== undefined;
  }, [recipeId, user, likedRecipes, likes]);

  // Fetch the recipe content on load up and whenever the recipeId changes (for mobile)
  useEffect(() => {
    fetchRecipe(recipeId).then(recipe => {
      if (recipe.error) {
        addSnack('Recipe not found', 'error');
        navigate('/');
      } else {
        setRecipe(recipe);
      }
    });

    // Update the cover image whenever the recipe changes (e.g. page refresh or recipe edit)
    const imageRef = ref(contentStorage, `recipes/${recipeId}/index.png`);
    getDownloadURL(imageRef)
      .then(url => setCoverImageUrl(url))
      .catch(() => {
        // Use default image if image not found
        console.error('Error getting image');
        setCoverImageUrl(toastie);
      });

    getPostLikes(recipeId).then(likes => setLikes(likes));
  }, [recipeId]);

  const handleLikeClick = async () => {
    if (!user) {
      addSnack('You must have an account to like this recipe.', 'warning');
      return false;
    }
    if (likedByUser) {
      setLikes(prevLikes => prevLikes - 1);
      setLikedRecipes(prevRecipes => prevRecipes.filter(id => id !== recipeId));
      return unlikeRecipe(recipeId, user.uid);
    } else {
      setLikes(prevLikes => prevLikes + 1);
      setLikedRecipes(prevRecipes => [...prevRecipes, recipeId]);
      return likeRecipe(recipeId, user.uid);
    }
  };

  return (
    <Container maxWidth={'md'}>
      {recipe ? (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} p={2}>
          <Typography variant={isNotTablet ? 'h4' : 'h5'}>{recipe?.title || 'Loading...'}</Typography>
          <div className="recipe--image--container">
            {coverImageUrl && <img className="recipe--image" src={coverImageUrl} alt="Recipe cover image" />}
          </div>
          <PublisherContainer publisherImageUrl={Wex} publisherName="Patriks Baller" />
          <Divider sx={{ my: 1 }} />
          <Likes totalLikes={likes} liked={likedByUser} onClick={handleLikeClick} />
          <section className="recipe--rating--container">
            <div>
              <Typography color="text">Time rating</Typography>
              <TimeRating value={recipe?.timeRating} size={isNotTablet ? 'large' : 'medium'} readOnly />
            </div>
            <div>
              <Typography color="text" align="right">
                Skill rating
              </Typography>
              <SkillRating value={recipe?.skillRating} size={isNotTablet ? 'large' : 'medium'} readOnly />
            </div>
          </section>

          {/* Recipe Content */}
          <section className="recipe--content--container">
            <Editor readOnly recipeData={JSON.parse(recipe.recipe || '')} />
          </section>

          {/* Comments Section */}
          <Box mb={10}>
            <CommentSection recipeId={recipeId} />
          </Box>
        </Box>
      ) : (
        <PageSkeleton />
      )}
    </Container>
  );
}

// Used for showing some empty content while the page is loading
function PageSkeleton() {
  return (
    <div>
      <Stack spacing={1} className="recipe--page--container" alignItems={'center'}>
        <Box sx={{ width: '100%' }}>
          <Skeleton variant="text" animation="wave" width={'100%'} height={40} />
          <Skeleton variant="rectangular" width={'100%'} height={300} animation="wave" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
          <Skeleton variant="circular" width={40} height={40} animation="wave" />
          <Skeleton variant="text" width={100} height={50} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Skeleton variant="text" animation="wave" width={100} />
            <Skeleton variant="rectangular" animation="wave" width={100} />
          </Box>
          <Box>
            <Skeleton variant="text" animation="wave" width={100} />
            <Skeleton variant="rectangular" animation="wave" width={100} />
          </Box>
        </Box>

        <Skeleton variant="rectangular" animation="wave" width={'100%'} height={300} />
      </Stack>
    </div>
  );
}
