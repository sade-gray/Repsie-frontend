import {IconButton} from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import {PublisherContainer} from "../routes/Recipe/components/PublisherContainer.tsx";
import React, {useEffect, useState} from "react";
import {RecipeCardData} from "../types/recipeTypes";
import {useAuth} from "../contexts/AuthContext.tsx";
import {useSnackBar} from "../contexts/SnackBarContext.tsx";
import {doc, updateDoc, arrayUnion, arrayRemove, setDoc} from "firebase/firestore";
import {db} from "../firebase.ts";

export default function FeedRecipeCard(props: RecipeCardData) {
    const [saved, setSaved] = useState(props.saved)
    const { user } = useAuth();
    const { addSnack }:any  = useSnackBar();

    // This usEffect is used to initialise the state of the save button from the cloud
    useEffect(() => {
        setSaved(props.saved)
    }, [props.saved]);

    const handleSaveToggle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Prevent from being redirected to the recipe pag
        e.preventDefault();
        // User must be logged in to save a recipe.
        if (!user) {
            addSnack("You must be signed in to save a recipe.", "error");
            return;
        }
        // Get a reference to the current recipe
        let userSavedRecipesDocRef = doc(db, `userSavedRecipes/${user.uid}`);
        // Create the document if it does not exist.
        if (!userSavedRecipesDocRef) {
            await setDoc(userSavedRecipesDocRef, {
                recipeRefs: [`/recipes/${props.id}`]
            }).then(() => {
                addSnack("Success! Saved the recipe.", "success");
            })
            return;
        }
        if (!saved) {
            await updateDoc(userSavedRecipesDocRef, {
                recipeRefs: arrayUnion(`/recipes/${props.id}`)
            }).then(() => addSnack("Success! Saved the recipe.", "success"));
        } else {
            await updateDoc(userSavedRecipesDocRef, {
                recipeRefs: arrayRemove(`/recipes/${props.id}`)
            }).then(() => addSnack("Success! Unsaved the recipe.", "success"));
        }
        setSaved(prevSaved => !prevSaved)
    }

    return (
        <article className={"feed--recipe--container"}>
            <div className={"recipe--title--container"}>
                <h2 className={"recipe--title"}>{props.title}</h2>
                <IconButton sx={{marginRight:"0.5rem"}} onClick={(e) => handleSaveToggle(e)}>
                    {saved
                        ? <BookmarkOutlinedIcon color={"secondary"} fontSize={"large"}/>
                        : <BookmarkBorderOutlinedIcon color={"secondary"} fontSize={"large"}/>
                    }
                </IconButton>
            </div>
            <PublisherContainer size={"small"}
                                color={"gray"}
                                publisherImageUrl={props.publisherImageUrl}
                                publisherName={props.publisherName}
            />
            <div className={"feed--recipe--image--container"}>
                <img src={props.imageUrl} alt={"food pic"}/>
            </div>
            <div className={"feed--recipe--action--buttons"}>
            </div>
        </article>
    )
}