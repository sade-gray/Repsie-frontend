import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth } from '../../firebase.ts';
import { User as FirebaseUser, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword } from 'firebase/auth';
import useSnackBar from '@context/SnackBarProvider';
import { useNavigate } from 'react-router-dom';
import { AuthContextValues } from './authTypes';
import { getTokenWithEmailAndPassword, signUpWithEmailAndPassword } from '@api/auth.ts';

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
    // Make a request to the backend auth api to create a user.
    return await signUpWithEmailAndPassword(email, password).then(res => {
      if (res.success) {
        signInWithEmailAndPassword(auth, email, password);
      }
      return res;
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

  /** Signs the user out */
  const signOut = () => {
    return auth.signOut();
  };

  /** Google Auth provider for signing in or up */
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(result => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
      })
      .catch(error => {
        // error could happen when the user cancels the sign in. We do not need to worry about that.
        console.log(error);
      });
  };

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
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
