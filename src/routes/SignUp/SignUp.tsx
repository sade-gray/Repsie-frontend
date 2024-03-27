import { Backdrop, Box, Button, CircularProgress, Container, Grid, IconButton, TextField, Typography } from '@mui/material';
import useAuth from '@context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './components/SignUpForm.tsx';
import GoogleIcon from '../../assets/GoogleIcon.svg';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import { setUsernameAndNumber } from '@api/user.ts';

export function SignUp() {
  const [stage, setStage] = useState(0);

  const goToNextStage = () => {
    setStage(prevState => prevState + 1);
  };

  return (
    <Box position={'relative'} overflow={'clip'}>
      <SignUpStage1 currStage={stage} goToNextStage={goToNextStage} />
      <SignUpStage2 currStage={stage} />
      <Button color={'secondary'} onClick={goToNextStage}>
        Next Stage
      </Button>
      <Button
        color={'secondary'}
        onClick={() => {
          setStage(0);
        }}
      >
        Previous stage
      </Button>
    </Box>
  );
}

/** The email and password sign up stage. */
function SignUpStage1(props: any) {
  const { signInWithGoogle } = useAuth();

  return (
    <Container maxWidth={'xs'} sx={{ mt: 5 }} className={`scale-transition ${props.currStage === 0 ? 'signup-stage1-show' : 'signup-stage1-hide'}`}>
      <Typography gutterBottom variant={'h4'} textAlign={'center'} fontWeight={'bold'}>
        Sign Up
      </Typography>

      <SignUpForm goToNextStage={props.goToNextStage} />

      <Grid container justifyContent={'center'} mt={10}>
        <Typography>Or Sign Up using</Typography>
        <Grid container justifyContent={'center'} alignItems={'centre'}>
          <IconButton color={'secondary'} onClick={signInWithGoogle}>
            <img src={GoogleIcon} alt={'Google Icon'} />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}

/** The username and profile icon stage */
function SignUpStage2(props: any) {
  const [username, setUsername] = useState('');
  const { user } = useAuth();
  const [waitingForSubmission, setWaitingForSubmission] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWaitingForSubmission(true);
    const response = await setUsernameAndNumber(user?.uid || 'ab', username);
    setWaitingForSubmission(false);
    // TODO: Add more error handling (maybe the username already exists?)
    if (response.message) {
      setSuccess(true);
      // Show the thank you message for two seconds then redirect to home.
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <>
      <Box
        sx={{ position: 'absolute', top: 0, left: 0, bgcolor: 'primary.main', width: '100vw', height: '80vh' }}
        className={`slide-in-transition ${props.currStage === 1 ? 'signup-stage2-show' : 'signup-stage2-hide'}`}
      >
        <Container maxWidth={'xs'}>
          <Typography gutterBottom variant={'h4'} textAlign={'center'} fontWeight={'bold'}>
            Nearly there!
          </Typography>
          <Typography gutterBottom textAlign={'center'}>
            Now it's time for you to choose your username.
          </Typography>
          <form onSubmit={handleUsernameSubmit}>
            <Grid container>
              <Grid container alignItems={'flex-end'} mb={4}>
                <PersonIcon sx={{ color: 'action.active', mr: 3, my: 0.5 }} />
                <Grid item xs={9} md={10}>
                  <TextField
                    onChange={e => setUsername(e.target.value)}
                    id="username-field"
                    label="Username"
                    placeholder={'BexyChef123'}
                    variant="standard"
                    color={'secondary'}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
              {/* Set Username Button */}
              <Button
                fullWidth
                sx={{ borderRadius: 5, mx: 5 }}
                // button is enabled only if all fields are filled, passwords match and the user has not pressed sign up already
                disabled={username === ''}
                size={'large'}
                variant={'contained'}
                color={'secondary'}
                type={'submit'}
              >
                {waitingForSubmission ? <CircularProgress size={25} /> : 'Submit'}
              </Button>
            </Grid>
          </form>
        </Container>
      </Box>
      {/* Show thank you message on username upload */}
      {success && (
        <Backdrop sx={{ zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
          <Container maxWidth={'xs'}>
            <Grid container alignItems={'center'} justifyContent={'center'} bgcolor={'primary.dark'} p={4} gap={1} borderRadius={4}>
              <Typography variant={'h4'}>Thank you!</Typography>
            </Grid>
          </Container>
        </Backdrop>
      )}
    </>
  );
}
