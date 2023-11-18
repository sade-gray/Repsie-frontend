/**
 * Requirements of this context provider
 * * To provide the app with information like:
 *      * The user's saved recipes (data only)
 *      * The user's liked recipes (data only)
 *      * The user's settings (dark mode, allergens etc)
 */
import {createContext, ReactNode, useEffect, useState} from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "../../firebase.ts";
import useAuth from "@context/AuthProvider";
import useSnackBar from "@context/SnackBarProvider";
import {UserData} from "./userDataTypes";

export const UserDataContext = createContext({} as UserData);

export function UserDataProvider({children}: {children: ReactNode}) {
    // This is an array of the ids of the saved recipes, as strings
    const [userSavedRecipes, setUserSavedRecipes] = useState<string[]>([]);
    const { addSnack } = useSnackBar();
    const { user } = useAuth();
    // const [loading, setLoading] = useState(true);
    // Reference to user's saved recipe document
    const userSavedRecipesDocRef = doc(db, `userSavedRecipes/${user?.uid}`);

    // Get user's saved recipes data
    // We have rules in firebase that do not allow non-owners of a document access
    useEffect(() => {
        if (!user) {
            return setUserSavedRecipes([]);
        }
        getDoc(userSavedRecipesDocRef)
            .then(doc => {
                // The user's saved recipes is an array of strings in a separate document
                // It might not exist. If it doesn't, create it.
                if (doc.exists()) {
                    const data = doc.data();
                    setUserSavedRecipes(data?.recipeRefs)
                } else {
                    setDoc(userSavedRecipesDocRef, {
                        recipeRefs: []
                    }).then(r => console.log(r))
                }
            })
            .catch(() => {
                addSnack("Error. Accessing unauthorised data.", "error");
            })
    }, [user]);

    const value: UserData = {
        userSavedRecipes,
        setUserSavedRecipes
    }

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    )
}
