import { Stack } from '@mui/material';
import SavedRecipeCard from '../components/SavedRecipeCard.tsx';
import useUserData from '@context/UserDataProvider';

/**
 * The list component used to display the saved recipes.
 * Currently, in use by the mobile drawer and home page.
 */
export default function SavedRecipesContainer() {
  // Get saved recipe items from context provider
  const { userSavedRecipes } = useUserData();

  const savedRecipeComponents = userSavedRecipes?.map((recipe, idx) => {
    return <SavedRecipeCard key={idx} {...recipe} />;
  });

  return (
    // TODO: Make the title sticky in the drawer. Make drawer round. Add swiping edge (like on iOS apps)
    <Stack maxHeight={'60vh'}>{userSavedRecipes.length === 0 ? 'You have no recipes saved!' : savedRecipeComponents || 'Loading'}</Stack>
  );
}
