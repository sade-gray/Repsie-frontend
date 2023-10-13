import {
    Box,
    Button,
    IconContainerProps,
    Rating,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import Editor from "./components/Editor";
import "./styles.scss";
import React, {ChangeEvent, useEffect, useState} from "react";
import {AccessTime, Create, FileUpload, LocalDining} from "@mui/icons-material";
import {saveRecipe} from "../../api/saveRecipe.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Descendant} from "slate";

export default function CreateRecipePage() {
    const initialValue = [
        {
            type: "paragraph",
            children: [{text: "Mmm so yummy"}],
        },
    ];
    const [skillRatingValue, setSkillRatingValue] = useState<number>(2);
    const [timeRatingValue, setTimeRatingValue] = useState<number>(2);
    const [colour, setColour] = useState<"success" | "error" | "warning" | "disabled">("disabled");
    const [imageUrl, setImageUrl] = useState();
    // const [coverImageFile, setCoverImageUrl] = useState();
    const [recipeData, setRecipeData] = useState<Descendant[]>(initialValue);
    const { user } = useAuth();
    function handleFormSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        if (imageUrl) {
            saveRecipe(user.uid, "macandcheese", imageUrl,  JSON.stringify(recipeData), skillRatingValue, timeRatingValue);
        } else {
            console.log("Invalid Image")
        }
    }

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        if (file !== undefined) {
            // @ts-ignore
            setImageUrl(file[0]);
        }
    };

    function changeColour(value?: number) {
        setColour(() => {
            const colour = !value || value === -1 ? skillRatingValue : value;
            switch (colour) {
                case 1:
                    return "success";
                case 2:
                    return "success";
                case 3:
                    return "warning";
                case 4:
                    return "error";
                case 5:
                    return "error";
                default:
                    return "disabled";
            }
        });
    }

    useEffect(() => {
        changeColour();
    }, [skillRatingValue]);

    const customIcons: {
        [index: string]: {
            icon: React.ReactElement;
        };
    } = {
        1: {
            icon: <LocalDining color={colour} fontSize='large' />,
        },
        2: {
            icon: <LocalDining color={colour} fontSize='large' />,
        },
        3: {
            icon: <LocalDining color={colour} fontSize='large' />,
        },
        4: {
            icon: <LocalDining color={colour} fontSize='large' />,
        },
        5: {
            icon: <LocalDining color={colour} fontSize='large' />,
        },
    };

    function IconContainer(props: IconContainerProps) {
        const {value, ...other} = props;
        return <span {...other}>{customIcons[value].icon}</span>;
    }

    const StyledRating = styled(Rating)(({theme}) => ({
        "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
            color: theme.palette.action.disabled,
        },
    }));

    return (
        <div className='create--recipe--container'>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <div className='create--recipe--title--container'>
                    <TextField
                        variant='outlined'
                        label='Recipe title'
                        name='title'
                        color='secondary'
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& > fieldset": {
                                    border: "solid 2px",
                                    borderColor: "secondary.main",
                                },
                            },
                            "& .MuiOutlinedInput-root:hover": {
                                "& > fieldset": {borderColor: "secondary.main"},
                            },
                            marginBottom: "2rem",
                        }}></TextField>
                </div>
                <div className='create--recipe--image--container'>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingY: 2,
                            border: "dashed 2px",
                            borderColor: "secondary.main",
                        }}>
                        <Button
                            variant='contained'
                            color='secondary'
                            component='label'
                            startIcon={<FileUpload />}>
                            Select Image
                            <input
                                hidden
                                accept='image/*'
                                type='file'
                                onChange={handleFileUpload}
                            />
                        </Button>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt='Uploaded Image'
                                height='auto'
                                width='300'
                                style={{marginTop: "1rem", minInlineSize: "100%"}}
                            />
                        )}
                    </Box>
                </div>
                <div className='create--recipe--editor--container'>
                    <Editor recipeData={recipeData}
                            setRecipeData={setRecipeData}
                            initial={"This is your journey to creating a delicious recipe"} />
                </div>
                <Box>
                    <div className='create--recipe--rating--container'>
                        <div>
                            <Typography color='text'>Time rating</Typography>
                            <StyledRating
                                value={timeRatingValue}
                                name='time-rating'
                                size='large'
                                icon={<AccessTime fontSize='large' color='secondary' />}
                                emptyIcon={<AccessTime fontSize='large' />}
                                onChange={(e, newValue) => {
                                    e.preventDefault();
                                    setTimeRatingValue(newValue || 1);
                                }}
                            />
                        </div>
                        <div>
                            <Typography color='text'>Skill rating</Typography>
                            <StyledRating
                                value={skillRatingValue}
                                name='skill-rating'
                                IconContainerComponent={IconContainer}
                                size='large'
                                onChangeActive={(e, value) => {
                                    e.preventDefault();
                                    changeColour(value);
                                }}
                                onChange={(e, newValue) => {
                                    e.preventDefault();
                                    setSkillRatingValue(newValue);
                                }}
                            />
                        </div>
                    </div>
                    <div className='create--recipe--button--container'>
                        <Button
                            color='secondary'
                            variant='contained'
                            size='medium'
                            type='submit'
                            startIcon={<Create />}>
                            Create
                        </Button>
                    </div>
                </Box>
            </form>
        </div>
    );
}
