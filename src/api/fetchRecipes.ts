/**
 * Fetches 3 recipes from the database with the offset starting point
 * @param offset
 * @return An array of RecipeCardData (empty if there were errors)
 */
export default async function fetchRecipes(offset: number) {
  return fetch(`https://us-central1-repsie.cloudfunctions.net/api/recipes?offset=${offset}`)
    .then(result => result.json())
    .then(recipes => {
      return recipes;
    })
    .catch(err => {
      console.error(err);
      return [];
    });
}
