import SavedRecipesContainer from "../../components/SavedRecipesContainer";
import savedRecipes from "../../assets/dummyData/savedRecipes.json";
import {useEffect, useState} from "react"
import CreateRecipeButton from "../../components/CreateRecipeButton";

export default function MyRecipesPage() {
    const [myRecipesComponents, setMyRecipesComponents]: any = useState();

    useEffect(() => {
        setMyRecipesComponents(savedRecipes.map((recipe: any) => {
            return (
                <div key={recipe['id']} className="my--recipe--item" style={{backgroundImage: `url(${recipe.imageUrl}`}}>
                    <span className="my--recipe--item--title">{recipe.title}</span>
                </div>
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