/**
 * Requirements of this context provider
 * * To provide the app with information like:
 *      * The user's saved recipes (data only)
 *      * The user's liked recipes (data only)
 *      * The user's settings (dark mode, allergens etc)
 */
import { createContext, ReactNode, useEffect, useState } from 'react';
import { getSavedRecipes } from '@api/recipe.ts';
import useAuth from '@context/AuthProvider';
import { UserData } from './userDataTypes';

export const UserDataContext = createContext({} as UserData);

/**
 * Provides the app with the user's data. This includes things like:
 *
 * - The list of the user's saved recipe ids
 * - The ability to update the list of the user's saved recipes
 * @param children the app to wrap
 * @constructor
 */
export function UserDataProvider({ children }: { children: ReactNode }) {
  // This is an array of the ids of the saved recipes, as strings
  const [userSavedRecipes, setUserSavedRecipes] = useState<string[]>([]);
  const { user } = useAuth();

  // Get user's saved recipes data, whenever the user changes (switch account, sign in, sign out etc...)
  useEffect(() => {
    if (!user) {
      return setUserSavedRecipes([]);
    }
    getSavedRecipes(user.uid).then(savedRecipes => {
      setUserSavedRecipes(savedRecipes);
    });
  }, [user]);

  // The values to return as part of the component API
  const value: UserData = {
    userSavedRecipes,
    setUserSavedRecipes,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}
