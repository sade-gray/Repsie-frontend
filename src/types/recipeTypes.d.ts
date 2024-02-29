export interface SavedRecipe {
  id: string;
  title: string;
  skillRating: number;
  timeRating: number;
  /** The user who created this recipe */
  userId: string;
}

interface RecipeCardData {
  id: string;
  title: string;
  image: string;
  saved: boolean;
  skillRating: number;
  timeRating: number;
}
