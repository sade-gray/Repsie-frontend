import {Box, Button, Rating, TextField, Typography} from "@mui/material";
import Editor from "./components/Editor";
import "./styles.scss";
import {ChangeEvent, useState} from "react";
import {FileUpload} from "@mui/icons-material";

export default function CreateRecipePage() {
    const [ratingValue, setRatingValue] = useState<number | null>(2);
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        if (!file) return;
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result as string);
        };

        reader.readAsDataURL(file[0]);
    };
    return (
        <div className='create--recipe--container'>
            <form>
                <div className='input--container'>
                    <TextField
                        variant='outlined'
                        label='Recipe title'
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
                            marginBottom: 2,
                        }}></TextField>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingY: 2,
                            gap: "1rem",
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
                        {imageUrl && <img src={imageUrl} alt='Uploaded Image' height='300' />}
                    </Box>
                </div>
                <div className='editor--container'>
                    <Editor inital='Method' />
                    <Editor inital='Ingredients' />
                </div>
                <Box>
                    <Typography color='text'>Difficulty</Typography>
                    <Rating
                        value={ratingValue}
                        name='difficulty-rating'
                        size='large'
                        onChange={(e, newValue) => {
                            e.preventDefault();
                            setRatingValue(newValue);
                        }}
                    />
                </Box>
            </form>
        </div>
    );
}
