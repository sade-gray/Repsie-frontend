import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Editor from './components/Editor';
import './styles.scss';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Check, CheckCircle, Create, FileUpload } from '@mui/icons-material';
import useAuth from '@context/AuthProvider';
import { Descendant } from 'slate';
import TimeRating from '@component/Ratings/TimeRating';
import SkillRating from '@component/Ratings/SkillRating';
import { createRecipe, editRecipe, fetchRecipe } from '@api/recipe.ts';
import { contentStorage } from '../../firebase.ts';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import useSnackBar from '@context/SnackBarProvider';

export function CreateRecipePage() {
  // Get the user from the context
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addSnack } = useSnackBar();
  // The state for the skill rating, time rating, title, image url, cover image url and recipe data
  const [skillRatingValue, setSkillRatingValue] = useState<number>(2);
  const [timeRatingValue, setTimeRatingValue] = useState<number>(2);
  const [title, setTitle] = useState<string>('');
  const [coverImage, setCoverImage] = useState<File | null>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [initRecipeData, setInitRecipeData] = useState<Descendant[]>([
    { type: 'paragraph', children: [{ text: 'This is your journey to creating a delicious recipe' }] } as Descendant,
  ]);
  const [recipeData, setRecipeData] = useState<Descendant[]>(initRecipeData);
  // Used for tracking the uploading progress
  const [recipeUploadStep, setRecipeUploadStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const recipeId = useRef(useParams()['recipeId'] || '');

  useEffect(() => {
    if (recipeId.current !== 'new') {
      fetchRecipe(recipeId.current)
        .then(recipe => {
          if (recipe.userId !== user?.uid) {
            addSnack('You do not have permission to edit this recipe', 'warning');
            navigate('/myRecipes');
            return;
          }
          if (recipe.error) {
            addSnack('Error editing recipe', 'error');
            navigate('/myRecipes');
          } else {
            setTitle(recipe.title);
            setSkillRatingValue(recipe.skillRating);
            setTimeRatingValue(recipe.timeRating);

            setRecipeData(JSON.parse(recipe.recipe));
            setInitRecipeData(JSON.parse(recipe.recipe));

            console.log('Inside: ', recipeData);
            setEditing(true);
          }
        })
        .catch(() => {
          addSnack('Error editing recipe', 'error');
          navigate('/myRecipes');
        });

      console.log('Outside: ', recipeData);

      // Update the cover image whenever the recipe changes (e.g. page refresh or recipe edit)
      const imageRef = ref(contentStorage, `recipes/${recipeId.current}/index.png`);
      getDownloadURL(imageRef)
        .then(url => setCoverPreview(url))
        .catch(() => {
          // Use default image if image not found
          console.error('Error getting image');
        });
    }
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return console.log('Must be logged in');
    }
    // Start showing the progress display
    setIsUploading(true);

    // Step 1: Upload the data
    if (editing) {
      await editRecipe(title, JSON.stringify(recipeData), timeRatingValue, skillRatingValue, recipeId.current).then(res => {
        if (res.error) {
          addSnack('Error editing recipe', 'error');
          setIsUploading(false);
        } else {
          if (res.id) {
            recipeId.current = res.id;
            setRecipeUploadStep(1);
          }
        }
      });
    } else {
      await createRecipe(user.uid, title, JSON.stringify(recipeData), skillRatingValue, timeRatingValue).then(res => {
        if (res.error) {
          addSnack('Error creating recipe', 'error');
          setIsUploading(false);
        } else {
          if (res.id) {
            recipeId.current = res.id;
            setRecipeUploadStep(1);
          }
        }
      });
    }

    // Step 2: Upload the image.
    const recipeImageRef = ref(contentStorage, `recipes/${recipeId.current}/index.png`);
    // Upload image if there was an image provided
    if (coverImage) {
      await uploadBytes(recipeImageRef, coverImage)
        .then(() => {
          setRecipeUploadStep(2);
        })
        .catch(error => {
          console.error(error);
          setIsUploading(false);
        });
    }

    // Success: We can tell the user that the recipe is uploaded
    setRecipeUploadStep(3);
  };

  // Handle the user uploading an image from their device.
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setCoverImage(e.target.files[0]);
  };

  // Update the image preview on every image upload
  useEffect(() => {
    if (!coverImage) {
      setCoverPreview(undefined);
      return;
    }
    // Create the image url from the file
    const objectUrl = URL.createObjectURL(coverImage);
    setCoverPreview(objectUrl);
  }, [coverImage]);

  return (
    <Box display={'flex'} justifyContent={'center'} m={'1rem'}>
      {/* Recipe Form */}
      <form onSubmit={e => handleFormSubmit(e)}>
        {/* Title */}
        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'}>
          <TextField
            variant="outlined"
            label="Title"
            name="title"
            color="primary"
            onChange={e => setTitle(e.target.value)}
            value={title}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& > fieldset': {
                  border: 'solid 2px',
                  borderColor: 'primary.main',
                },
              },
              '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': { borderColor: 'primary.main' },
              },
              marginBottom: '2rem',
            }}
          />
        </Box>
        {/* Image select */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingY: 2,
            border: 'dashed 2px',
            borderColor: 'primary.main',
            marginBottom: '2rem',
          }}
        >
          <Button variant="contained" color="primary" component="label" startIcon={<FileUpload />}>
            Select Image
            <input hidden accept="image/png, image/jpeg" type="file" onChange={handleImageUpload} />
          </Button>
          {coverPreview && (
            <img src={coverPreview} alt="Uploaded Image" height="auto" width="300" style={{ marginTop: '1rem', minInlineSize: '100%' }} />
          )}
        </Box>
        {/* Editor */}
        <Box mb={'2rem'}>
          <Editor initRecipeData={initRecipeData} recipeData={recipeData} setRecipeData={setRecipeData} />
        </Box>
        {/* Ratings */}
        <Box display={'flex'} justifyContent={'space-between'} mb={'2rem'}>
          <Box>
            <Typography color="text">Time rating</Typography>
            <TimeRating value={timeRatingValue} handleChange={(value: number) => setTimeRatingValue(value)} />
          </Box>
          <Box>
            <Typography color="text">Skill rating</Typography>
            <SkillRating value={skillRatingValue} handleChange={(value: number) => setSkillRatingValue(value)} />
          </Box>
        </Box>
        {/* Submit button */}
        <Box display={'flex'} justifyContent={'flex-end'} mb={'4rem'}>
          <Button color="primary" variant="contained" size="medium" type="submit" startIcon={<Create />}>
            {editing ? 'Save' : 'Create'}
          </Button>
        </Box>
      </form>
      {isUploading && <RecipeUploadProgressDisplay step={recipeUploadStep} recipeId={recipeId.current} editing={editing} />}
    </Box>
  );
}

const steps = ['Uploading your recipe content', 'Uploading your cover image', 'Success!'];

function RecipeUploadProgressDisplay(props: any) {
  const [open] = useState(true);
  const [step, setStep] = useState(props.step);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setStep(props.step);
    setLoading(false);

    setTimeout(() => {
      setLoading(true);
    }, 500);
  }, [props.step]);

  return (
    <Dialog open={open}>
      <Box sx={{ margin: 2 }}>
        <Stepper activeStep={step} connector={<QontoConnector />} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container justifyContent={'center'} height={400} alignContent={'center'} direction={'column'} gap={3}>
          {step === 3 ? (
            <>
              <Typography>Success! Your recipe has been {props.editing ? 'saved' : 'created'}!</Typography>
              <Button variant={'contained'} color={'primary'} onClick={() => navigate(`/recipe/${props.recipeId}`)}>
                Check it out!
              </Button>
            </>
          ) : loading ? (
            <CircularProgress color={'secondary'} />
          ) : (
            <CheckCircle color={'primary'} fontSize={'large'} />
          )}
        </Grid>
      </Box>
    </Dialog>
  );
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
    </QontoStepIconRoot>
  );
}
