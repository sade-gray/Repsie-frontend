import { RecipeCardData } from '../../types/recipeTypes';

export interface UserData {
  userSavedRecipes: RecipeCardData[];
  setUserSavedRecipes: (state?: any) => void;
}
