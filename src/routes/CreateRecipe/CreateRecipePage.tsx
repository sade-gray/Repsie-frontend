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
import {ChangeEvent, useEffect, useState} from "react";
import {AccessTime, Create, FileUpload, LocalDining} from "@mui/icons-material";

export default function CreateRecipePage() {
    const [skillRatingValue, setSkillRatingValue] = useState<number | null>(2);
    const [timeRatingValue, setTimeRatingValue] = useState<number | null>(2);
    const [colour, setColour] = useState<"success" | "error" | "warning" | "disabled">("disabled");
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

    function changeColour(value?: number) {
        setColour(() => {
            let colour = !value || value === -1 ? skillRatingValue : value;
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
            <form>
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
                    <Editor inital='' />
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
                                    setTimeRatingValue(newValue);
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
