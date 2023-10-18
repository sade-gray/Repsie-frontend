import Wex from "../../assets/wex.png"
import GourmetToastie from "../../assets/gourmet-toastie.jpg";
import FeedRecipeCard from "../../components/FeedRecipeCard.tsx";
import SavedRecipesContainer from "../../components/SavedRecipesContainer.tsx";
import {Divider} from "@mui/material";
import {useEffect, useState} from "react";
import { recipesCollectionRef} from "../../firebase.ts";
import { getDocs } from "firebase/firestore";
import {Link} from "react-router-dom";
import { RecipeCard } from "../../types/recipeTypes";

export default function Home() {

    const [recipeData, setRecipeData] = useState<RecipeCard[]>();

    useEffect(() => {
        getDocs(recipesCollectionRef)
            .then(results => {
                setRecipeData(prevData => {
                    return [
                        ...results.docs.map(doc => {
                            let docData = doc.data()
                            return {
                                id: doc.id,
                                title: docData.title,
                                skillRating: docData.skillRating,
                                timeRating: docData.timeRating,
                                image: ""
                            }
                        })
                    ]
                })
        })
            .catch(error => console.log(error))
    }, [])

    const recipeComponents = recipeData?.map(recipe => {
        return (
            <Link to={`/recipe/${recipe.id}`}>
                <FeedRecipeCard key={recipe.id} title={recipe.title} imageUrl={GourmetToastie} publisherName={"50 Sades of Gray"} publisherImageUrl={Wex} />
            </Link>
        )
    })

    return (
        <>
            <div className={"main--container"}>
                <section className={"saved--recipe--section"}>
                    <SavedRecipesContainer />
                </section>
                <section className={"recipes--feed--container"}>
                    <div className={"recipes--feed"}>
                        <h1>For you</h1>
                        <Divider />
                        {/* Feed Card go here */}
                        {recipeComponents}
                    </div>
                </section>
                <section className={"chef--recommendation--container"}>
                    Chefs to follow
                </section>
            </div>
        </>
    )
}