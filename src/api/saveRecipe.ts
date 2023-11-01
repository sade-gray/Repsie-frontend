import { recipesCollectionRef } from "../firebase.ts";
import { addDoc } from "firebase/firestore";
import { uploadBytes, ref } from "firebase/storage"
import { contentStorage } from "../firebase.ts";
import {serverTimestamp } from "firebase/firestore";

export function saveRecipe(userId: string, title: string, image: any, recipe: string, skillRating: number, timeRating: number) {
    const imageRef = ref(contentStorage, `recipeImages/${image.name}`);
    addDoc(recipesCollectionRef, {
        userId: userId,
        title: title,
        image: imageRef.name,
        recipe: recipe,
        skillRating: skillRating,
        timeRating: timeRating,
        datePublished: serverTimestamp()
    }).then((data) => {
            console.log("Success! Doc saved with id", data.id)
            console.log("Uploading image")
            uploadBytes(imageRef, image, {contentType:"image/jpeg"})
                .then(() => {
                    console.log("Uploaded a data_url string!");
                })
            // uploadBytes(imageRef, image)
            //     .then(() => console.log("Uploaded file"))
        }
    )
        .catch(e => console.log("Error", e))
}
