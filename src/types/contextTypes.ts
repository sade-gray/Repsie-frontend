import {Dispatch, SetStateAction} from "react";
import {savedRecipe} from "./recipeTypes";

export interface IContextType {
    drawerOpen: boolean;
    setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export interface UserData {
    userSavedRecipes: savedRecipe[],
    setUserSavedRecipes: (state?: any) => any,
}