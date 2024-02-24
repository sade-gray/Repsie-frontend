import { Button } from '@mui/material';
import SignUpForm from './components/SignUpForm.tsx';
import useAuth from '@context/AuthProvider';
import { Navigate } from 'react-router-dom';

export function SignUp() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={''} />;
  } else {
    return (
      <main className={'sign--up--container'}>
        <SignUpForm />
        <Button variant={'outlined'} color={'secondary'}>
          Sign up with Google
        </Button>
      </main>
    );
  }
}
