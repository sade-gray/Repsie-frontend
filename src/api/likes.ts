// import { RecipeCardData } from 'types/recipeTypes';
import { API_URL } from '@api/index.ts';

/**
 * Gets the number of likes for a post
 */
export async function getPostLikes(id: string) {
  return fetch(`${API_URL}/rating/post?post=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error('Error getting likes for recipe', id, data.error);
        return 0;
      }
      return data.totalLikes as number;
    });
}

/**
 * Fetches a list of the user's liked posts
 * @param id the user id
 * @returns an array of ids?
 */
export async function getUserLikes(id: string) {
  return fetch(`${API_URL}/rating/user?user=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.log('Error getting liked recipes:', data.error);
        return [];
      }
      return data.getNumUserLikes as string[];
    });
}

/**
 * Likes a recipe
 * @param recipeId the recipe id
 * @param uid the user id
 * @returns whether the post was succesfully liked
 */
export async function likeRecipe(recipeId: string, uid: string) {
  return fetch(`${API_URL}/rating?user=${uid}&post=${recipeId}`, {
    method: 'POST',
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error('Error liking recipe:', data.error);
        return false;
      }
      return true;
    });
}

/**
 * Unlikes a recipe
 * @param recipeId the recipe id
 * @param uid the user id
 * @returns whether the post was succesfully liked
 */
export async function unlikeRecipe(recipeId: string, uid: string) {
  return fetch(`${API_URL}/rating?user=${uid}&post=${recipeId}`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error('Error unliking recipe:', data.error);
        return false;
      }
      return true;
    });
}
