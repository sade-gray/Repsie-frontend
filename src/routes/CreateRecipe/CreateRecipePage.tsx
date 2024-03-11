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
import { FormEvent, useEffect, useState } from 'react';
import { Check, CheckCircle, Create, FileUpload } from '@mui/icons-material';
import useAuth from '@context/AuthProvider';
import { Descendant } from 'slate';
import TimeRating from '@component/Ratings/TimeRating';
import SkillRating from '@component/Ratings/SkillRating';
import { createRecipe } from '@api/recipe.ts';
import { contentStorage } from '../../firebase.ts';
import { ref, uploadBytes } from 'firebase/storage';

// The initial value for the recipe
const initialValue = [{ type: 'paragraph', children: [{ text: 'This is your journey to creating a delicious recipe' }] }];

export function CreateRecipePage() {
  // The state for the skill rating, time rating, title, image url, cover image url and recipe data
  const [skillRatingValue, setSkillRatingValue] = useState<number>(2);
  const [timeRatingValue, setTimeRatingValue] = useState<number>(2);
  const [title, setTitle] = useState<string>('');
  const [coverImage, setCoverImage] = useState();
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  // Used for tracking the uploading progress
  const [recipeUploadStep, setRecipeUploadStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [recipeData, setRecipeData] = useState<Descendant[]>(initialValue);
  // Get the user from the context
  const { user } = useAuth();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return console.log('Must be logged in');
    }
    // Start showing the progress display
    setIsUploading(true);
    let recipeId = '';

    // Step 1: Upload the data
    await createRecipe(user.uid, title, JSON.stringify(recipeData), skillRatingValue, timeRatingValue).then(res => {
      if (res.id) {
        recipeId = res.id;
        setRecipeUploadStep(1);
      }
    });

    // Step 2: Upload the image.
    const recipeImageRef = ref(contentStorage, `recipes/${recipeId}/index.png`);
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
    <div className="create--recipe--container">
      <form onSubmit={e => handleFormSubmit(e)}>
        <div className="create--recipe--title--container">
          <TextField
            variant="outlined"
            label="Title"
            name="title"
            color="secondary"
            onChange={e => setTitle(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& > fieldset': {
                  border: 'solid 2px',
                  borderColor: 'secondary.main',
                },
              },
              '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': { borderColor: 'secondary.main' },
              },
              marginBottom: '2rem',
            }}
          />
        </div>
        <div className="create--recipe--image--container">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingY: 2,
              border: 'dashed 2px',
              borderColor: 'secondary.main',
            }}
          >
            <Button variant="contained" color="secondary" component="label" startIcon={<FileUpload />}>
              Select Image
              <input hidden accept="image/png, image/jpeg" type="file" onChange={e => setCoverImage(e.target.files[0])} />
            </Button>
            {coverPreview && (
              <img src={coverPreview} alt="Uploaded Image" height="auto" width="300" style={{ marginTop: '1rem', minInlineSize: '100%' }} />
            )}
          </Box>
        </div>
        <div className="create--recipe--editor--container">
          <Editor readOnly={false} recipeData={recipeData} setRecipeData={setRecipeData} />
        </div>
        <Box>
          <div className="create--recipe--rating--container">
            <div>
              <Typography color="text">Time rating</Typography>
              <TimeRating value={timeRatingValue} handleChange={(value: number) => setTimeRatingValue(value)} />
            </div>
            <div>
              <Typography color="text">Skill rating</Typography>
              <SkillRating value={skillRatingValue} handleChange={(value: number) => setSkillRatingValue(value)} />
            </div>
          </div>
          <div className="create--recipe--button--container">
            <Button color="secondary" variant="contained" size="medium" type="submit" startIcon={<Create />}>
              Create
            </Button>
          </div>
        </Box>
      </form>
      {isUploading && <RecipeUploadProgressDisplay step={recipeUploadStep} />}
    </div>
  );
}

const steps = ['Uploading your recipe content', 'Uploading your cover image', 'Success!'];

function RecipeUploadProgressDisplay(props) {
  const [open] = useState(true);
  const [step, setStep] = useState(props.step);
  const [loading, setLoading] = useState(true);

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
        <Grid container justifyContent={'center'} height={400} alignContent={'center'}>
          {step === 3 ? (
            <Typography>Yippie</Typography>
          ) : loading ? (
            <CircularProgress color={'secondary'} />
          ) : (
            <CheckCircle color={'secondary'} fontSize={'large'} />
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
