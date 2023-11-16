import {Box, Button, Rating, TextField, Typography, styled} from "@mui/material";
import Editor from "./components/Editor";
import "./styles.scss";
import {ChangeEvent, FormEvent, useState} from "react";
import {AccessTime, Create, FileUpload} from "@mui/icons-material";
import {saveRecipe} from "../../api/saveRecipe.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {Descendant} from "slate";

export function CreateRecipePage() {
    const initialValue = [
        {
            type: "paragraph",
            children: [{text: "This is your journey to creating a delicious recipe"}],
        },
    ];
    const [skillRatingValue, setSkillRatingValue] = useState<number>(2);
    const [timeRatingValue, setTimeRatingValue] = useState<number>(2);
    const [title, setTitle] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>();
    const [coverImageUrl, setCoverImageUrl] = useState<string>();
    const [recipeData, setRecipeData] = useState<Descendant[]>(initialValue);
    const {user} = useAuth();

    function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (imageUrl && user) {
            saveRecipe(
                user.uid,
                title,
                imageUrl,
                JSON.stringify(recipeData),
                skillRatingValue,
                timeRatingValue
            );
        } else {
            console.log("Invalid image or user");
        }
    }

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        if (!file) return;

        if (file[0] !== undefined) {
            // @ts-ignore
            setImageUrl(file[0]);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImageUrl(reader.result as string);
        };

        reader.readAsDataURL(file[0]);
    };

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
                        label='Title'
                        name='title'
                        color='secondary'
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
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
                                src={coverImageUrl}
                                alt='Uploaded Image'
                                height='auto'
                                width='300'
                                style={{marginTop: "1rem", minInlineSize: "100%"}}
                            />
                        )}
                    </Box>
                </div>
                <div className='create--recipe--editor--container'>
                    <Editor
                        readOnly={false}
                        recipeData={recipeData}
                        setRecipeData={setRecipeData}
                    />
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
