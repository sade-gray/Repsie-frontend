import Wex from "../../assets/wex.png"
import GourmetToastie from "../../assets/gourmet-toastie.jpg";
import FeedRecipeCard from "../../components/FeedRecipeCard.tsx";
import SavedRecipesContainer from "../../components/SavedRecipesContainer.tsx";
import {Divider} from "@mui/material";

export default function Home() {
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
                        {/* TODO: Make a list */}
                        <FeedRecipeCard title={"Gourmet Toastie"}
                                        imageUrl={GourmetToastie}
                                        publisherName={"50 Sadés of Gray"}
                                        publisherImageUrl={Wex}
                        />
                        <Divider />
                        <FeedRecipeCard title={"Gourmet Toastie"}
                                        imageUrl={GourmetToastie}
                                        publisherName={"50 Sadés of Gray"}
                                        publisherImageUrl={Wex}
                        />
                        <Divider />

                        <FeedRecipeCard title={"Gourmet Toastie"}
                                        imageUrl={GourmetToastie}
                                        publisherName={"50 Sadés of Gray"}
                                        publisherImageUrl={Wex}
                        />
                        <Divider color={""}/>

                        <FeedRecipeCard title={"Gourmet Toastie"}
                                        imageUrl={GourmetToastie}
                                        publisherName={"50 Sadés of Gray"}
                                        publisherImageUrl={Wex}
                        />
                    </div>
                </section>
                <section className={"chef--recommendation--container"}>
                    Chefs to follow
                </section>
            </div>
        </>
    )
}