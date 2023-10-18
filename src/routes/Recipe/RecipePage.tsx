import "./styles.scss";
import {PublisherContainer} from "./components/PublisherContainer.tsx";
import Wex from "../../assets/wex.png";
import {getDownloadURL} from "firebase/storage";
import {IconContainerProps, Rating, Typography, styled} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ref} from "firebase/storage";
import {contentStorage} from "../../firebase.ts";
import {Descendant} from "slate";
import Editor from "../CreateRecipe/components/Editor.tsx";
import {AccessTime, LocalDining} from "@mui/icons-material";

export default function RecipePage() {
    const recipeId = useParams()["recipeId"];
    const [coverImageUrl, setCoverImageUrl] = useState<string>();
    const imageUrl = "macandcheese.jpg";
    const macRef = ref(contentStorage, `recipeImages/${imageUrl}`);

    useEffect(() => {
        getDownloadURL(macRef).then((url) => {
            setCoverImageUrl(url);
        });
    }, []);

    const initialValue: Descendant[] = [
        {
            type: "bulleted-list",
            children: [
                {
                    type: "list-item",
                    children: [{text: "This is your journey to creating a delicious recipe"}],
                },
                {type: "list-item", children: [{text: ""}]},
                {type: "list-item", children: [{text: ""}]},
                {type: "list-item", children: [{text: "adad"}, {text: "adadadadad", italic: true}]},
            ],
        },
    ];

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
                <Typography variant={"h3"}>Gooey Mac & Cheese (id: {recipeId})</Typography>
                <img className={"recipe--image"} src={coverImageUrl} alt={"Mac and Cheese"} />

                <PublisherContainer publisherImageUrl={Wex} publisherName={"Patriks Baller"} />

                <section className={"rating--container"}>
                    <div>
                        <Typography color='text'>Time rating</Typography>
                        <StyledRating
                            readOnly
                            value={2}
                            size='large'
                            icon={<AccessTime fontSize='large' color='secondary' />}
                            emptyIcon={<AccessTime fontSize='large' />}
                        />
                    </div>
                    <div>
                        <Typography color='text'>Skill rating</Typography>
                        <StyledRating
                            readOnly
                            value={2}
                            name='skill-rating'
                            IconContainerComponent={IconContainer}
                            size='large'
                        />
                    </div>
                </section>

                <section className={"recipe--content--container"}>
                    <Editor readOnly={true} recipeData={initialValue} setRecipeData={() => {}} />
                    {/* <div className={"recipe--ingredients--container"}>
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
                    </div> */}
                </section>
            </div>
        </main>
    );
}
