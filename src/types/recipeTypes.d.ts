export interface savedRecipe {
  id: string;
  title: string;
  imageUrl: string;
  publisher: {
    name: string;
    iconUrl: string;
  };
}

interface RecipeCardData {
  id: string,
  title: string;
  image: string;
  saved: boolean;
  skillRating: number;
  timeRating: number;
}
