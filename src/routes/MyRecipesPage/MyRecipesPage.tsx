import SavedRecipesContainer from "../../components/SavedRecipesContainer";
import {useEffect, useState} from "react"
import CreateRecipeButton from "./Components/CreateRecipeButton";
import { Button, Chip } from "@mui/material";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Link, Navigate} from "react-router-dom";
import {db, recipesCollectionRef} from "../../firebase.ts";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";

export function MyRecipesPage() {
    const [createdRecipes, setCreatedRecipes]: any = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        // Only fetch the created recipes if user is logged in
        if (!user) return;
        // Get the user's created Recipes
        const createdRecipesRef = collection(db, "users", user.uid, "createdRecipes");
        getDocs(createdRecipesRef)
            .then(async createdRecipesSnap => {
                if (createdRecipesSnap.empty) {
                    return;
                }
                // For each document in the result
                createdRecipesSnap.forEach(createdRecipeDocRef => {
                    // Create a document reference from the doc
                    const recipeRef = doc(recipesCollectionRef, createdRecipeDocRef.data().recipeRef);
                    // Fetch the doc and save the data to memory
                    getDoc(recipeRef).then(doc => {
                        setCreatedRecipes((prevCreatedRecipes: any[]) => [
                                ...prevCreatedRecipes,
                                {
                                    id: doc.id,
                                    ...doc.data()
                                }
                            ])
                    }).catch(e => console.log(e));
                });
            }).catch(e => console.log(e));
    }, []) // Get user's created recipes once mounted

    const createdRecipesComponents = createdRecipes.map((recipe: any) => {
        return (
            <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="my--recipe--item">
                <Button>
                    <div style={{backgroundImage: `url(${recipe.imageUrl}`}}>
                        <Chip label={recipe.title} variant="filled" color="secondary"/>
                    </div>
                </Button>
            </Link>
        )
    })
    // Redirect to home if user is not logged in
    if (!user) {
        return <Navigate to={"/"} />
    }
    return (
        <div className={"main--container"}>
            <section className={"saved--recipe--section"}>
                <SavedRecipesContainer />
            </section>
            <section className={"my--recipes--section"}>
                <h2>My Recipes</h2>
                <div className={"my--recipes--container"}>
                    {createdRecipesComponents}
                    <CreateRecipeButton />
                </div>
            </section>
        </div>
    )
}
