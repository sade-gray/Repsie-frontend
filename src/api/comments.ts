/**
 * This file contains the function used for handling comments for recipes
 * - Show comments
 * - Make a comment
 * - Edit a comment
 * - Remove a comment
 */
import { Comment } from '../types/commentTypes';

const apiUrl = 'https://us-central1-repsie.cloudfunctions.net/api';

/**
 * Gets a list of comments for a post
 * @param id the id of the recipe
 */
export async function getComments(id: string) {
  return fetch(`${apiUrl}/comments?post=${id}`)
    .then(response => response.json())
    .then(result => {
      if (result.message && result.message.startsWith('Something went wrong')) {
        console.error('Error fetching comments');
        return [];
      }
      return result as Comment[];
    })
    .catch(err => {
      console.error('Error getting comments: ', err);
      return [];
    });
}
