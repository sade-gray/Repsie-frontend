import { RecipeCardData } from '../../types/recipeTypes';

export interface UserData {
  userSavedRecipes: RecipeCardData[];
  // TODO: Change this to RecipeCardData[] if the api changes
  likedRecipes: string[];
  setLikedRecipes: React.Dispatch<React.SetStateAction<string[]>>;
  setUserSavedRecipes: (state?: any) => void;
  username: string;
}
