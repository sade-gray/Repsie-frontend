/**
 * Requirements of this context provider
 * * To provide the app with information like:
 *      * The user's saved recipes (data only)
 *      * The user's liked recipes (data only)
 *      * The user's settings (dark mode, allergens etc)
 */
import { createContext, ReactNode, useEffect, useState } from "react";
import { getSavedRecipes} from '@api/bookmarkRecipe.ts';
import useAuth from "@context/AuthProvider";
import { UserData } from "./userDataTypes";

export const UserDataContext = createContext({} as UserData);

export function UserDataProvider({ children }: { children: ReactNode }) {
  // This is an array of the ids of the saved recipes, as strings
  const [userSavedRecipes, setUserSavedRecipes] = useState<string[]>([]);
  const { user } = useAuth();
  // const [loading, setLoading] = useState(true);
  // Reference to user's saved recipe document

  // Get user's saved recipes data
  // We have rules in firebase that do not allow non-owners of a document access
  useEffect(() => {
    if (!user) {
      return setUserSavedRecipes([]);
    }
    getSavedRecipes(user.uid).then(savedRecipes => {
      setUserSavedRecipes(savedRecipes);
    });
  }, [user]);

  const value: UserData = {
    userSavedRecipes,
    setUserSavedRecipes,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}
