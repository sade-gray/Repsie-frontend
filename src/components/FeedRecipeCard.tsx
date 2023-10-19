import {IconButton} from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import {PublisherContainer} from "../routes/Recipe/components/PublisherContainer.tsx";
import React, {useState} from "react";

interface RecipeCardData {
    title: string,
    imageUrl: string,
    publisherName: string,
    publisherImageUrl: string
}

export default function FeedRecipeCard(props: RecipeCardData) {
    const [saved, setSaved] = useState(false)
    const handleSaveToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Prevent from being redirected to the recipe pag
        e.preventDefault();
        setSaved(prevSaved => !prevSaved)
    }

    return (
        <article className={"feed--recipe--container"}>
            <div className={"recipe--title--container"}>
                <h2 className={"recipe--title"}>{props.title}</h2>
                <IconButton sx={{marginRight:"0.5rem"}} onClick={(e) => handleSaveToggle(e)}>
                    {saved
                        ? <BookmarkBorderOutlinedIcon color={"secondary"} fontSize={"large"}/>
                        : <BookmarkOutlinedIcon color={"secondary"} fontSize={"large"}/>
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