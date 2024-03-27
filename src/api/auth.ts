import { API_URL } from '@api/index.ts';

/**
 * Makes a request to the firebase functions api to get a token to sign in with on the client
 * @param email
 * @param password
 * @return JWTTOken - the token to be used to sign in with
 */
export async function getTokenWithEmailAndPassword(email: string, password: string) {
  return fetch(`${API_URL}/user/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(async res => {
    return await res.text();
  });
}

/**
 * Signs a user up with email and password
 * @param email
 * @param password
 */
export async function signUpWithEmailAndPassword(email: string, password: string) {
  return fetch(`${API_URL}/user/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then(res => res.json())
    .then(data => {
      const toReturn = {
        success: false,
        message: '',
      };

      if (data.error) {
        toReturn.message = data.error;
      } else if (data.message.startsWith('Password must')) {
        toReturn.message = data.message;
        // Successful user creation
      } else {
        toReturn.success = true;
      }
      return toReturn;
    });
}
