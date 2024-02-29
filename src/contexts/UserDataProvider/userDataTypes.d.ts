import { SavedRecipe } from '../../types/recipeTypes';

export interface UserData {
  userSavedRecipes: SavedRecipe[];
  setUserSavedRecipes: (state?: any) => void;
}
