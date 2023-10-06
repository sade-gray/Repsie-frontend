import SavedRecipesContainer from "../../components/SavedRecipesContainer";
import savedRecipes from "../../assets/dummyData/savedRecipes.json";
import {useEffect, useState} from "react"
import CreateRecipeButton from "./Components/CreateRecipeButton";
import { Button, Chip } from "@mui/material";

export default function MyRecipesPage() {
    const [myRecipesComponents, setMyRecipesComponents]: any = useState();

    useEffect(() => {
        setMyRecipesComponents(savedRecipes.map((recipe: any) => {
            return (
                <Button>
                    <div key={recipe['id']} className="my--recipe--item" style={{backgroundImage: `url(${recipe.imageUrl}`}}>
                        <Chip label={recipe.title} variant="filled" color="secondary"/>
                    </div>
                </Button>
            )
        }))
        setMyRecipesComponents((prevRecipeComponents: Element[]) => {
            return [...prevRecipeComponents,<CreateRecipeButton key={-1}/>]
        })
    }, [])


    return (
        <div className={"main--container"}>
            <section className={"saved--recipe--section"}>
                <SavedRecipesContainer />
            </section>
            <section className={"my--recipes--section"}>
                <h2>My Recipes</h2>
                <div className={"my--recipes--container"}>
                    {myRecipesComponents}
                </div>
            </section>
        </div>
    )
}