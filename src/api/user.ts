import { IUser } from 'types/userTypes';
import { API_URL } from '.';

/**
 * Retrieves the username and number for a given user ID.
 * @param userId The ID of the user.
 * @returns Username and number for the user. If an error occurs, an empty array is returned.
 */
export async function getUsernameAndNumber(userId: string): Promise<IUser> {
  return fetch(`${API_URL}/settings/phone-name?user=${userId}`)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log('Error: ', err);
      return [];
    });
}
