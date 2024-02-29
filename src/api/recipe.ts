/**
 * This file contains all the functions that deal with recipes. This includes:
 *
 * - List View and Single View of recipes, saved recipes, created recipes, list recipes
 */

const apiUrl = 'https://us-central1-repsie.cloudfunctions.net/api';

/**
 * Gets a list of the user's saved recipes.
 * @param userId
 */
export async function getSavedRecipes(userId: string) {
  return fetch(`${apiUrl}/saved?user=${userId}`)
    .then(res => res.json())
    .then(savedRecipes => {
      return savedRecipes;
    });
}

/**
 * Saves a recipe to a user's profile
 * TODO: add authorisation (anyone can save a recipe to anyone else's profile)
 * @param recipeId
 * @param userId
 * @return whether the recipe could be saved or not
 */
export async function saveRecipe(recipeId: string, userId: string) {
  return fetch(`${apiUrl}/saved?user=${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: recipeId,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return false;
      }
      return true;
    });
}

/**
 * Unsaves a recipe from a user's profile
 * @param recipeId
 * @param userId
 * @return whether the recipe was unsaved or not.
 */
export async function unsaveRecipe(recipeId: string, userId: string) {
  return fetch(`${apiUrl}/saved?user=${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: recipeId,
    }),
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.error) {
        console.error(data.error);
        return false;
      }
      return true;
    });
}

/**
 * Fetches 3 recipes from the database with the offset starting point
 * @param offset
 * @return An array of RecipeCardData (empty if there were errors)
 */
export default async function fetchRecipes(offset: number) {
  return fetch(`${apiUrl}/recipes?offset=${offset}`)
    .then(result => result.json())
    .then(recipes => {
      return recipes;
    })
    .catch(err => {
      console.error(err);
      return [];
    });
}
