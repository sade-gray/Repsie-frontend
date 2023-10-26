import {Button, Stack} from "@mui/material";
import SavedRecipeCard from "../components/SavedRecipeCard.tsx";
import {useEffect, useState} from "react";
import { savedRecipe } from "../types/recipeTypes.ts";
import {getDocs, query, where} from "firebase/firestore"
import { recipesCollectionRef } from "../firebase.ts"
import {useUserData} from "../contexts/UserDataContext.tsx";
import {Link} from "react-router-dom";
import GourmetToastie from "../assets/dummyPhotos/gourmet-toastie.jpg";

/**
 * The list component used to display the saved recipes.
 * Currently, in use by the mobile drawer and home page.
 */
export default function SavedRecipesContainer() {
    // Get ids of saved recipe from context
    const { userSavedRecipes } = useUserData();
    const [savedRecipes, setSavedRecipes] = useState<any>();

    // TODO: This function makes the api call whenever a user saves or unsaves a recipe
    useEffect(() => {
        // Do not make the query if the user has no saved recipes.
        if (userSavedRecipes.length === 0) return;
        // Find all the user's saved recipes data. __name__ refers to the document's id.
        const q = query(recipesCollectionRef, where('__name__','in', userSavedRecipes))
        getDocs(q).then((results) => {
            setSavedRecipes(() => results.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                } as savedRecipe
            }))
        })
    }, [userSavedRecipes]);

    const savedRecipeComponents = savedRecipes?.map((recipe: savedRecipe, idx: number) => {
    // Each Saved Recipe is a link to its page.
        return (
            <Link to={`/recipe/${recipe.id}`} key={idx}>
                <Button fullWidth>
                    <SavedRecipeCard
                        imageUrl={GourmetToastie}
                        title={recipe.title}
                        publisher={recipe.publisher}
                        id={recipe.id}
                    />
                </Button>
            </Link>
        );
    });

    const savedRecipesList = (
        <Stack className={"saved--recipes--list"}>
            {userSavedRecipes.length === 0
            ? "You have no recipes saved!"
            : savedRecipeComponents || "Loading"}
        </Stack>
    )

    return (
        <div>
            <h3 className={"saved--recipes--section--title"}>Saved Recipes</h3>
            {savedRecipesList}
        </div>
    )
}