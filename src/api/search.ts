import { API_URL } from '.';
import { Recipe } from 'types/searchTypes';

/**
 * Searches for recipes based on the provided query.
 * @param query - The search query.
 * @returns An array of recipes matching the query.
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
  return fetch(`${API_URL}/search?title=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return [];
      }
      return data;
    });
}
