import Wex from "../../assets/wex.png"
import GourmetToastie from "../../assets/dummyPhotos/gourmet-toastie.jpg";
import FeedRecipeCard from "../../components/FeedRecipeCard.tsx";
import SavedRecipesContainer from "../../components/SavedRecipesContainer.tsx";
import {Divider, Skeleton, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import { recipesCollectionRef} from "../../firebase.ts";
import {Link} from "react-router-dom";
import { RecipeCard } from "../../types/recipeTypes";
import {getDocs} from "firebase/firestore";
import {useUserData} from "../../contexts/UserDataContext.tsx";

export default function Home() {
    const [recipeData, setRecipeData] = useState<RecipeCard[]>([]);
    const {userSavedRecipes}: any = useUserData();
    // Helper function to check if a recipe exists in the user's saved recipes list
    function checkIfRecipeSaved(id: string): boolean {
        return userSavedRecipes?.includes(`${id}`) || false
    }

    useEffect( () => {
        // Fetch some recipes
        getDocs(recipesCollectionRef)
            .then(results => {
                setRecipeData((prevData) => {
                    return [
                        ...prevData,
                        ...results.docs.map(doc => {
                            let docData = doc.data()
                            return {
                                id: doc.id,
                                title: docData.title,
                                skillRating: docData.skillRating,
                                timeRating: docData.timeRating,
                                image: "",
                                savedByUser: checkIfRecipeSaved(doc.id)
                            }
                        })
                    ]
                })
            })
    }, [])
    // Once the user's saved recipes data has been fetched, check if any of them have been saved.
    useEffect(() => {
        setRecipeData(prevRecipeData => prevRecipeData.map((recipe: any )=> {
            return {
                ...recipe,
                savedByUser: checkIfRecipeSaved(recipe.id)
            }
        }))
    }, [userSavedRecipes]);

    // Turn the recipe data into components for rendering
    const recipeComponents = recipeData?.map((recipe, idx) => {
        return (
            <article key={idx}>
                <Link to={`/recipe/${recipe.id}`}>
                    <FeedRecipeCard title={recipe.title}
                                    imageUrl={GourmetToastie}
                                    publisherName={"50 Sades of Gray"}
                                    publisherImageUrl={Wex}
                                    id={recipe.id}
                                    saved={recipe.savedByUser}
                    />
                </Link>
                <Divider />
            </article>
        )
    })

    return (
        <div className={"main--container"}>
            <section className={"saved--recipe--section"}>
                <SavedRecipesContainer />
            </section>
            <section className={"recipes--feed--container"}>
                <div className={"recipes--feed"}>
                    <h1>For you</h1>
                    <Divider />
                    {/* Feed Card go here */}
                    {recipeComponents?.length === 0
                        ?
                        // Render the skeletons while data is being fetched
                        <Stack spacing={3} mt={2}>
                            <Stack spacing={2}>
                                <Skeleton variant={"rounded"} height={50} animation={"wave"}/>
                                <Skeleton variant={"rectangular"} height={300} animation={"wave"} sx={{mb:"1"}}/>
                            </Stack>
                            <Divider />
                            <Stack spacing={2}>
                                <Skeleton variant={"rounded"} height={50} animation={"wave"} />
                                <Skeleton variant={"rectangular"} height={300} animation={"wave"} />
                            </Stack>
                            <Divider />
                        </Stack>
                        // Render the actual recipes when the data makes it here
                        : recipeComponents
                    }
                </div>
            </section>
            <section className={"chef--recommendation--container"}>
                Chefs to follow
            </section>
        </div>
    )
}
