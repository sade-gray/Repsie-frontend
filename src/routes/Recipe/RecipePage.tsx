import "./styles.scss"
import { PublisherContainer } from "./components/PublisherContainer.tsx";
import Wex from "../../assets/wex.png"
import {getDownloadURL} from "firebase/storage";
import {Rating, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ref} from "firebase/storage";
import {contentStorage} from "../../firebase.ts";

export default function RecipePage() {
    const recipeId = useParams()["recipeId"];
    const [coverImageUrl, setCoverImageUrl] = useState<string>();
    const imageUrl = "macandcheese.jpg"
    const macRef = ref(contentStorage, `recipeImages/${imageUrl}`)

    useEffect(() => {
        getDownloadURL(macRef)
            .then(url => {
                setCoverImageUrl(url);
            })
    }, []);

    return (
        <main className={"recipe--page"}>
            <div className={"recipe--container"}>
                <Typography variant={"h3"} >Gooey Mac & Cheese (id: {recipeId})</Typography>
                <img className={"recipe--image"}
                     src={coverImageUrl}
                     alt={"Mac and Cheese"}/>

                <PublisherContainer publisherImageUrl={Wex}
                                    publisherName={"Patriks Baller"}/>

                <section className={"rating--container"}>
                    {/* TODO: Apply logic for rendering this.*/}
                    <Rating disabled size={"large"} value={4}/>
                    <span className={"average--rating--text"}>4/5</span>
                </section>

                <section className={"recipe--content--container"}>
                    <div className={"recipe--ingredients--container"}>
                        <h1>Ingredients</h1>
                        <h4>For Macaroni</h4>
                        <ul>
                            <li>500g macaroni</li>
                            <li>A pinch of salt</li>
                        </ul>
                        <h4>For Cheese</h4>
                        <ul>
                            <li>200g parmesan</li>
                            <li>300g red cheddar</li>
                            <li>150ml full-fat milk</li>
                            <li>1tbsp salted butter</li>
                            <li>50g flour</li>
                        </ul>
                    </div>

                    <div className={"recipe--method--container"}>
                        <h1>Method</h1>
                        <ol>
                            <li>Add water to a pot, add a pinch of salt and boil.</li>
                            <li>While the water is heating, place butter on a pan</li>
                            <li>Add parmesan, red cheddar and milk and stir until</li>
                        </ol>
                    </div>


                </section>

            </div>
        </main>

    );
}