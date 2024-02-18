import { getDocs, limit, orderBy, query, startAt } from "firebase/firestore";
import { recipesCollectionRef } from "../firebase.ts";
import { RecipeCardData } from "../types/recipeTypes";

const recipeFetchLimit = 3;

/**
 * Fetches 3 recipes from the database with the offset starting point
 * @param offset
 * @return An array of RecipeCardData (empty if there were errors)
 */
export default async function fetchRecipes(offset: number) {
  const q = query(recipesCollectionRef, orderBy("datePublished"),
    startAt(offset), limit(recipeFetchLimit),
  );

  return getDocs(q)
    .then(results => {
      return results.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          // TODO: Should the API give us the url? Or can we get the image url given the recipe ID?
          image: "",
        } as RecipeCardData;
      });
    })
    .catch(err => {
      console.error("Error fetching recipes: ", err);
      return [];
    });
}
