/**
 * This file contains the function used for handling comments for recipes
 * - Show comments
 * - Make a comment
 * - Edit a comment
 * - Remove a comment
 */
import { API_URL } from '@api/index.ts';
import { Comment } from '../types/commentTypes';

/**
 * Gets a list of comments for a post
 * @param id the id of the recipe
 */
export async function getComments(id: string) {
  return fetch(`${API_URL}/comments?post=${id}`)
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

/**
 * Adds a comment to a post
 * @param id The id of the recipe.
 * @param commentBody The body of the comment.
 * @param userId The id of the user making the comment.
 */
export async function postComment(id: string, commentBody: string, userId: string) {
  return fetch(`${API_URL}/comments?post=${id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      commentBody: commentBody,
      userId: userId,
    }),
  })
    .then(response => response.json())
    .then(result => {
      if (result.message && result.message.startsWith('Something went wrong')) {
        console.error('Error adding comment');
        return false;
      }
      return true;
    })
    .catch(err => {
      console.error('Error adding comment: ', err);
      return false;
    });
}

/**
 * Deletes a comment
 * @param recipeId the recipe id
 * @param commentId the comment id
 * @return whether the comment was deleted successfully
 */
export async function deleteComment(recipeId: string, commentId: string) {
  return fetch(`${API_URL}/comments?post=${recipeId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commentId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.log('Error deleting comment:', data.error);
        return false;
      }
      console.log(data);
      return true;
    });
}
