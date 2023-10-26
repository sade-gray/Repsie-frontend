/**
 * Requirements of this context provider
 * * To provide the app with information like:
 *      * The user's saved recipes (data only)
 *      * The user's liked recipes (data only)
 *      * The user's settings (dark mode, allergens etc)
 */
import {createContext, useContext, useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.ts";
import {useAuth} from "./AuthContext.tsx";
import {useSnackBar} from "./SnackBarContext.tsx";
import {UserData} from "../types/contextTypes.ts";
import {savedRecipe} from "../types/recipeTypes";

const UserDataContext = createContext({} as UserData);

export function useUserData() {
    return useContext(UserDataContext)
}

export function UserDataProvider({children}: any) {
    // This is an array of the ids of the saved recipes, as strings
    const [userSavedRecipes, setUserSavedRecipes] = useState<savedRecipe[]>([]);
    const { addSnack }: any = useSnackBar();
    const { user } = useAuth();
    // const [loading, setLoading] = useState(true);

    // Get user's saved recipes data
    // We have rules in firebase that do not allow non-owners of a document access
    useEffect(() => {
        getDoc(doc(db, `userSavedRecipes/${user?.uid}`))
            .then(results => {
                const data = results.data();
                setUserSavedRecipes(data?.recipeRefs)
            })
            .catch(() => {
                addSnack("Error. Accessing unauthorised data.", "error");
            })
    }, []);

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