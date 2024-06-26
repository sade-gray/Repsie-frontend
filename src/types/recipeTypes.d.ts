export interface RecipeCardData {
  id: string;
  title: string;
  image: string;
  saved?: boolean;
  skillRating: number;
  timeRating: number;
  userId: string;
  removeRecipe: (id: string) => void;
}

export interface RecipeData extends RecipeCardData {
  recipe: string;
}
