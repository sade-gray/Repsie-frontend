import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '../../firebase.ts';
import { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import useSnackBar from '@context/SnackBarProvider';
import { useNavigate } from 'react-router-dom';
import { AuthContextValues } from './authTypes';
import { getTokenWithEmailAndPassword } from '@api/auth.ts';

export const AuthContext = createContext({} as AuthContextValues);

/**
 * Provides the app with authentication functionality
 * @param children the app to wrap
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>();
  const [loading, setLoading] = useState(true);
  const { addSnack } = useSnackBar();
  const navigate = useNavigate();

  /**
   * Signs user up with email and password.
   * @param email
   * @param password
   */
  const emailSignUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          setUser(user);
          addSnack(`Success! Logged in as ${user.displayName || user.email}`);
          return true;
        }
        return false;
      })
      .catch(error => {
        console.log(error.message);
        return false;
      });
  };

  /**
   * Signs user in with email and password
   * @param email
   * @param password
   * @return whether the user was able to sign in
   */
  const emailSignIn = async (email: string, password: string) => {
    const token = await getTokenWithEmailAndPassword(email, password);
    // If there was an issue signing in on the backend, return false
    if (token === '') return false;

    return signInWithCustomToken(auth, token)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        if (user) {
          addSnack(`Success! Logged in as ${user.displayName || user.email}`);
          navigate('/');
          return true;
        }
        return false;
      })
      .catch(error => {
        console.log(error.message);
        return false;
      });
  };

  /**
   * Signs the user out
   */
  const signOut = () => {
    return auth.signOut();
  };
  // TODO: Add update email and password functions
  // TODO: Add Google Auth.

  // Adds an event listener to the user's authentication status
  // E.g. Makes the user object null when signed out and sets or removes the jwt token
  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (user) {
        // Generate the id token for the user and then update the app
        user.getIdToken(true).then(idToken => {
          localStorage.setItem('id-token', idToken);
          setUser(user);
        });
      } else {
        // Delete the id token on sign-out
        localStorage.removeItem('id-token');
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  // The values this Provider provides for its API.
  const value: AuthContextValues = {
    user,
    emailSignUp,
    emailSignIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
