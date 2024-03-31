import { Container, Grid, IconButton, Typography } from '@mui/material';
import SignInForm from './components/SignInForm.tsx';
import useAuth from '@context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '../../assets/GoogleIcon.svg';

export function SignIn() {
  const { user, signInWithGoogle } = useAuth();

  if (user) {
    return <Navigate to={'/'} />;
  }

  return (
    <Container maxWidth={'xs'} sx={{ mt: 5 }}>
      <Typography gutterBottom variant={'h4'} textAlign={'center'} fontWeight={'bold'}>
        Sign in
      </Typography>

      <SignInForm />

      <Grid container justifyContent={'center'} mt={10}>
        <Typography>Or Sign Up using</Typography>
        <Grid container justifyContent={'center'} alignItems={'centre'}>
          <IconButton color="primary" sx={{ width: 40 }} component={Link} to={'/signup'}>
            <EmailIcon fontSize={'medium'} />
          </IconButton>
          <IconButton onClick={signInWithGoogle}>
            <img src={GoogleIcon} alt={'Google Icon'} />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}
