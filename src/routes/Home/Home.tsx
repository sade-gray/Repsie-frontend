import Wex from "../../assets/wex.png"
import GourmetToastie from "../../assets/gourmet-toastie.jpg";
import FeedRecipeCard from "../../components/FeedRecipeCard.tsx";
import SavedRecipesContainer from "../../components/SavedRecipesContainer.tsx";

export default function Home() {
    return (
        <>
            <div className={"main--container"}>
                <section className={"saved--recipe--section"}>
                    <SavedRecipesContainer />
                </section>
                <section className={"recipes--feed--container"}>
                    <h1>Recipes for your mom</h1>
                    {/* TODO: Make a list */}
                    <FeedRecipeCard title={"Gourmet Toastie"}
                                    imageUrl={GourmetToastie}
                                    publisherName={"50 Sadés of Gray"}
                                    publisherImageUrl={Wex}
                    />
                    <FeedRecipeCard title={"Gourmet Toastie"}
                                    imageUrl={GourmetToastie}
                                    publisherName={"50 Sadés of Gray"}
                                    publisherImageUrl={Wex}
                    />
                    <FeedRecipeCard title={"Gourmet Toastie"}
                                    imageUrl={GourmetToastie}
                                    publisherName={"50 Sadés of Gray"}
                                    publisherImageUrl={Wex}
                    />
                    <FeedRecipeCard title={"Gourmet Toastie"}
                                    imageUrl={GourmetToastie}
                                    publisherName={"50 Sadés of Gray"}
                                    publisherImageUrl={Wex}
                    />
                </section>
                <section className={"chef--recommendation--container"}>
                    Chefs to follow
                </section>
            </div>
        </>
    )
}