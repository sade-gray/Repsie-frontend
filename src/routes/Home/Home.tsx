import Wex from '../../assets/wex.png';
import GourmetToastie from '../../assets/dummyPhotos/gourmet-toastie.jpg';
import FeedRecipeCard from '../../components/FeedRecipeCard.tsx';
import SavedRecipesContainer from '../../components/SavedRecipesContainer.tsx';
import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { recipesCollectionRef } from '../../firebase.ts';
import { Link } from 'react-router-dom';
import { RecipeCard } from '../../types/recipeTypes';
import { getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import useUserData from '@context/UserDataProvider';

const recipeFetchLimit = 4;

export default function Home() {
  const [recipeData, setRecipeData] = useState<RecipeCard[]>([]);
  const { userSavedRecipes } = useUserData();
  // We use useRef as this variable should not trigger re-renders.
  const recipeOffset = useRef(0);

  // Helper function to check if a recipe exists in the user's saved recipes list
  function checkIfRecipeSaved(id: string): boolean {
    return userSavedRecipes?.includes(id);
  }

  // Function that gets recipes from the cloud
  function fetchRecipes() {
    const q = query(
      recipesCollectionRef,
      orderBy('datePublished'),
      startAt(recipeOffset.current),
      limit(recipeFetchLimit)
    );
    recipeOffset.current += recipeFetchLimit;
    getDocs(q).then((results) => {
      setRecipeData((prevData) => {
        return [
          ...prevData,
          ...results.docs.map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              title: docData.title,
              skillRating: docData.skillRating,
              timeRating: docData.timeRating,
              image: '',
              saved: checkIfRecipeSaved(doc.id),
            };
          }),
        ];
      });
    });
  }

  // Function used for infinite scroll
  function handleScroll(e: any) {
    // Check if user is at bottom of feed
    const bottom =
      e.target.scrollTop + e.target.clientHeight == e.target.scrollHeight;
    // Fetch more recipes if so
    if (bottom) {
      fetchRecipes();
    }
  }

  // Fetch first few recipes
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Once the user's saved recipes data has been fetched, check if any of them have been saved.
  // Check if feed recipes are saved by user whenever the user saves or unsaves a recipe
  useEffect(() => {
    // Return the same array of recipes but update the savedByUser field
    setRecipeData((prevRecipeData) =>
      prevRecipeData.map((recipe: any) => {
        return {
          ...recipe,
          saved: checkIfRecipeSaved(recipe.id),
        };
      })
    );
  }, [userSavedRecipes]);

  // Turn the recipe data into components for rendering
  const recipeComponents = recipeData?.map((recipeInfo, idx) => {
    return (
      <article key={idx}>
        <Link to={`/recipe/${recipeInfo.id}`}>
          {/*TODO: Remove the hardcoded publisher and images */}
          <FeedRecipeCard
            imageUrl={GourmetToastie}
            publisherName={'"50 Sades of Gray"'}
            publisherImageUrl={Wex}
            {...recipeInfo}
          />
        </Link>
        <Divider />
      </article>
    );
  });

  return (
    <div className={'main--container'}>
      <section className={'saved--recipe--section'}>
        <SavedRecipesContainer />
      </section>
      <section className={'recipes--feed--container'} onScroll={handleScroll}>
        <div className={'recipes--feed'}>
          <Typography variant={'h1'}>For you</Typography>
          <Divider />
          {/* Feed Card go here */}
          {recipeComponents?.length === 0 ? (
            // Render the skeletons while data is being fetched
            <Stack spacing={3} mt={2}>
              <Stack spacing={2}>
                <Skeleton variant={'rounded'} height={50} animation={'wave'} />
                <Skeleton
                  variant={'rectangular'}
                  height={300}
                  animation={'wave'}
                  sx={{ mb: '1' }}
                />
              </Stack>
              <Divider />
              <Stack spacing={2}>
                <Skeleton variant={'rounded'} height={50} animation={'wave'} />
                <Skeleton
                  variant={'rectangular'}
                  height={300}
                  animation={'wave'}
                />
              </Stack>
              <Divider />
            </Stack>
          ) : (
            // Render the actual recipes when the data makes it here
            recipeComponents
          )}
        </div>
      </section>
      <section className={'chef--recommendation--container'}>
        Chefs to follow
      </section>
    </div>
  );
}
