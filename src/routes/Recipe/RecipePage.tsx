import {PublisherContainer} from "./components/PublisherContainer.tsx";
import Wex from "../../assets/wex.png";
import {getDownloadURL} from "firebase/storage";
import {IconContainerProps, Rating, styled, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ref} from "firebase/storage";
import {contentStorage, recipesCollectionRef} from "../../firebase.ts";
import {doc, getDoc} from "firebase/firestore";
import Editor from "../CreateRecipe/components/Editor.tsx";
import {AccessTime, LocalDining} from "@mui/icons-material";

export default function RecipePage() {
    const recipeId = useParams()["recipeId"];
    const [coverImageUrl, setCoverImageUrl] = useState<string>();
    const imageUrl = "macandcheese.jpg"
    const macRef = ref(contentStorage, `recipeImages/${imageUrl}`)
    const [recipeContent, setRecipeContent] = useState<any>();

    useEffect(() => {
        getDoc(doc(recipesCollectionRef, recipeId))
            .then((res) => {
                if (res.exists()) {
                    console.log(res.data().recipe)
                    setRecipeContent(res.data());
                } else {
                    console.log("Didnt find that shit")
                }
            })
            .catch(error => console.log(error))
        // console.log(recipe);
        getDownloadURL(macRef)
            .then(url => {
                setCoverImageUrl(url);
            })
    }, []);

    const StyledRating = styled(Rating)(({theme}) => ({
        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
            color: theme.palette.action.disabled,
        },
    }));

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
        };
    } = {
        1: {
            icon: <LocalDining color='success' fontSize='large' />,
        },
        2: {
            icon: <LocalDining color='success' fontSize='large' />,
        },
        3: {
            icon: <LocalDining color='warning' fontSize='large' />,
        },
        4: {
            icon: <LocalDining color='error' fontSize='large' />,
        },
        5: {
            icon: <LocalDining color='error' fontSize='large' />,
        },
    };

    function IconContainer(props: IconContainerProps) {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    return (
        <main className={"recipe--page"}>
            <div className={"recipe--container"}>
                <Typography variant={"h3"}>{recipeContent?.title || "Loading..."}</Typography>
                <img className={"recipe--image"} src={coverImageUrl} alt={"Mac and Cheese"} />
                <PublisherContainer publisherImageUrl={Wex} publisherName={"Patriks Baller"} />

                <section className={"rating--container"}>
                    <div>
                        <Typography color='text'>Time rating</Typography>
                        <StyledRating
                            readOnly
                            value={recipeContent?.timeRating || 0}
                            size='large'
                            icon={<AccessTime fontSize='large' color='secondary' />}
                            emptyIcon={<AccessTime fontSize='large' />}
                        />
                    </div>
                    <div>
                        <Typography color='text'>Skill rating</Typography>
                        <StyledRating
                            readOnly
                            value={recipeContent?.skillRating || 0}
                            name='skill-rating'
                            IconContainerComponent={IconContainer}
                            size='large'
                        />
                    </div>
                </section>

                <section className={"recipe--content--container"}>
                    {recipeContent ?
                        <Editor readOnly={true} recipeData={JSON.parse(recipeContent.recipe || "")} setRecipeData={() => {}} />
                        :
                        <Typography> Loading that shit</Typography>
                    }
                </section>
            </div>
        </main>

    );
}
