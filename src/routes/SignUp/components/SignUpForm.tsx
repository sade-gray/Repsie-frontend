import { Button, CircularProgress, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAuth from '@context/AuthProvider';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignUpForm(props: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [waitingForSignup, setWaitingForSignup] = useState(false);

  const { emailSignUp } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    // Check if passwords match after 2 seconds.
    setTimeout(() => {
      if (confirmPassword !== '' && password !== confirmPassword) {
        setSignupError('Passwords do not match');
      } else {
        setSignupError('');
      }
    }, 2000);
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Try to sign up with the current credentials.
    setWaitingForSignup(true);
    const authResponse = await emailSignUp(email, password);
    setWaitingForSignup(false);
    // Go to the username & pfp stage if successful, show error otherwise
    if (authResponse.success) {
      console.log('Successfully signed up!');
      props.goToNextStage();
    } else {
      setSignupError('An error has occurred. Try again later.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container justifyContent={'center'} gap={2}>
        {/* Email field*/}
        <Grid container alignItems={'flex-end'}>
          <EmailIcon sx={{ color: 'action.active', mr: 3, my: 0.5 }} />
          <Grid item xs={9} md={10}>
            <TextField onChange={handleEmailChange} id="email-field" label="Email" variant="standard" color={'secondary'} required fullWidth />
          </Grid>
        </Grid>

        {/* Password Field*/}
        <Grid container alignItems={'flex-end'}>
          <LockIcon sx={{ color: 'action.active', mr: 2, my: 1.5 }} />
          <Grid item xs={9} md={10}>
            <FormControl sx={{ m: 1 }} variant={'standard'} color={'secondary'} fullWidth>
              <InputLabel htmlFor="password-field" required>
                Password
              </InputLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle passwor>d visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Confirm Password Field */}
        <Grid container alignItems={'flex-end'}>
          <LockIcon sx={{ color: 'action.active', mr: 2, my: 1.5 }} />
          <Grid item xs={9} md={10}>
            <FormControl sx={{ m: 1 }} variant={'standard'} color={'secondary'} fullWidth>
              <InputLabel htmlFor="confirm-password-field" required>
                Confirm Password
              </InputLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password-field"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                fullWidth
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container justifyContent={'left'} px={6}>
          {signupError !== '' && (
            <Typography variant={'body2'} color={'error'}>
              {signupError}
            </Typography>
          )}
        </Grid>

        {/* Sign in Button */}
        <Button
          fullWidth
          sx={{ borderRadius: 5, mx: 5 }}
          // button is enabled only if all fields are filled, passwords match and the user has not pressed sign up already
          disabled={email === '' || password === '' || confirmPassword === '' || password !== confirmPassword || waitingForSignup}
          size={'large'}
          variant={'contained'}
          color={'secondary'}
          type={'submit'}
        >
          {waitingForSignup ? <CircularProgress size={25} /> : 'Sign up'}
        </Button>
      </Grid>
    </form>
  );
}
