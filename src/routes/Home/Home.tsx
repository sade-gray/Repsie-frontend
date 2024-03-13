import FeedRecipeCard from '../../components/FeedRecipeCard.tsx';
import SavedRecipesContainer from '../../components/SavedRecipesContainer.tsx';
import { Divider, Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { RecipeCardData } from '../../types/recipeTypes';
import useUserData from '@context/UserDataProvider';

import { fetchRecipes } from '@api/recipe.ts';
import { theme } from '../../theme.ts';

export default function Home() {
  const [recipeData, setRecipeData] = useState<RecipeCardData[]>([]);
  const { userSavedRecipes } = useUserData();
  // We use useRef as this variable should not trigger re-renders.
  const recipeOffset = useRef(0);
  const isNotTablet = useMediaQuery(theme.breakpoints.up('lg'));

  // Helper function to check if a recipe exists in the user's saved recipes list
  function isRecipeSaved(id: string): boolean {
    return userSavedRecipes?.find(recipe => recipe.id === id) !== undefined;
  }

  /**
   * Fetches more recipes and appends them to the recipe feed
   */
  function getMoreRecipes() {
    fetchRecipes(recipeOffset.current).then(newRecipes => {
      setRecipeData(prevRecipes => [...prevRecipes, ...newRecipes]);
    });
  }

  // Fetch first few recipes
  useEffect(() => {
    getMoreRecipes();
  }, []);

  // Once the user's saved recipes data has been fetched, check if any of them have been saved.
  // Check if feed recipes are saved by user whenever the user saves or unsaves a recipe
  useEffect(() => {
    // Return the same array of recipes but update the savedByUser field
    setRecipeData(prevRecipeData =>
      prevRecipeData.map(recipe => {
        return {
          ...recipe,
          saved: isRecipeSaved(recipe.id),
        };
      })
    );
  }, [userSavedRecipes]);

  // Fetch more recipes when user is near bottom of page
  useEffect(() => {
    const handleScroll = () => {
      const winDoc = document.documentElement;
      const scrolledToBottom = winDoc.scrollHeight === winDoc.scrollTop + winDoc.clientHeight;
      if (scrolledToBottom) {
        getMoreRecipes();
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Turn the recipe data into components for rendering
  const recipeComponents = recipeData?.map((recipe, idx) => {
    return <FeedRecipeCard {...recipe} key={idx} />;
  });

  return (
    <div className={'main--container'}>
      {isNotTablet && <SavedRecipesContainer />}
      <section className={'recipes--feed--container'}>
        <div className={'recipes--feed'}>
          <Typography variant={'h4'}>For you</Typography>
          <Divider />
          {/* Feed Card go here; Show the skeleton until the recipes are fetched */}
          {recipeComponents?.length === 0 ? <HomePageSkeleton /> : recipeComponents}
        </div>
      </section>
      <section className={'chef--recommendation--container'}>Chefs to follow</section>
    </div>
  );
}

function HomePageSkeleton() {
  return (
    <Stack spacing={3} mt={2}>
      <Stack spacing={2}>
        <Skeleton variant={'rounded'} height={50} animation={'wave'} />
        <Skeleton variant={'rectangular'} height={300} animation={'wave'} sx={{ mb: '1' }} />
      </Stack>
      <Divider />
      <Stack spacing={2}>
        <Skeleton variant={'rounded'} height={50} animation={'wave'} />
        <Skeleton variant={'rectangular'} height={300} animation={'wave'} />
      </Stack>
      <Divider />
    </Stack>
  );
}
