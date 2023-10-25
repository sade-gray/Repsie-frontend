import {List, ListItemButton} from "@mui/material";
import SavedRecipeCard from "../components/SavedRecipeCard.tsx";
import {useEffect, useState} from "react";
import { savedRecipe } from "../types/recipeTypes.ts";

/**
 * The list component used to display the saved recipes.
 * Currently, in use by the mobile drawer and home page.
 */
export default function SavedRecipesContainer() {
    const [savedRecipes, setSavedRecipes] = useState<Array<savedRecipe>>();

    // Fetch saved recipes of current user
    useEffect(() => {

    }, []);

    const savedRecipeComponents = savedRecipes?.map((recipe: savedRecipe, idx: number) => {
    // Each Saved Recipe is a link to its page.
        return (
            <ListItemButton sx={{p:0, m:1}} key={idx}>
                <SavedRecipeCard
                    imageUrl={recipe.imageUrl}
                    title={recipe.title}
                    publisher={recipe.publisher}
                />
            </ListItemButton>
        );
    });

    const savedRecipesList = (
        <List className={"saved--recipes--list"}>
            {savedRecipeComponents || "Loading"}
        </List>
    )

    return (
        <div>
            <h3 className={"saved--recipes--section--title"}>Saved Recipes</h3>
            {savedRecipesList}
        </div>
    )
}